#!/usr/bin/env bash
# Render both hero compositions, encode to the site's budget, and verify.
#   bash scripts/encode-hero.sh
# Dev affordance: VERIFY_ONLY=1 bash scripts/encode-hero.sh skips the render+encode section and
# re-runs only the verification loop against the already-committed public/hero/*.mp4 files.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ "${VERIFY_ONLY:-0}" != "1" ]; then
  cd "$ROOT/video"

  npx remotion render HeroLoop out/hero-16x9-master.mp4 --codec h264 --crf 12
  npx remotion render HeroLoopMobile out/hero-9x16-master.mp4 --codec h264 --crf 12

  mkdir -p "$ROOT/public/hero"
  enc() { # in out scale
    ffmpeg -y -i "$1" -an -vf "scale=$3,format=yuv420p" -c:v libx264 -preset slow -crf 28 -g 90 -pix_fmt yuv420p -movflags +faststart "$2"
  }
  enc out/hero-16x9-master.mp4 "$ROOT/public/hero/loop-16x9.mp4" 1280:720
  enc out/hero-9x16-master.mp4 "$ROOT/public/hero/loop-9x16.mp4"  720:1280
fi

cd "$ROOT"
fail=0
for f in public/hero/loop-16x9.mp4 public/hero/loop-9x16.mp4; do
  size=$(stat -f%z "$f")
  echo "$f: $size bytes"
  [ "$size" -le 2621440 ] || { echo "  ✗ over 2.5 MB"; fail=1; }
  # no audio stream — capture ALL streams' codec_types once (not select_streams a: a valid
  # video-only file always has >=1 stream, so a genuinely failed/empty probe is now
  # distinguishable from the legitimate "no audio stream" case, which the old
  # `select_streams a | grep -q audio` could not tell apart — both read as empty).
  streams=$(ffprobe -v error -show_entries stream=codec_type -of csv=p=0 "$f")
  [ -n "$streams" ] || { echo "  ✗ could not read streams"; fail=1; continue; }
  echo "$streams" | grep -q audio && { echo "  ✗ has audio"; fail=1; }
  # faststart: moov atom appears before mdat in the byte stream (equivalent to the trace-parse
  # check; hardened per task-11 resolution notes to avoid relying on `ffprobe -v trace` output
  # formatting).
  moov_off=$(grep -abo "moov" "$f" | head -1 | cut -d: -f1)
  mdat_off=$(grep -abo "mdat" "$f" | head -1 | cut -d: -f1)
  if [ -z "$moov_off" ] || [ -z "$mdat_off" ] || [ "$moov_off" -ge "$mdat_off" ]; then
    echo "  ✗ moov not first (moov=$moov_off mdat=$mdat_off)"; fail=1;
  fi
  # first frame black: mean luma of frame 0 must be < 4/255
  # hardened per task-11 resolution notes: read the YAVG tag directly from signalstats via the
  # lavfi movie source instead of parsing ffmpeg's metadata=print log text.
  mean=$(ffprobe -v error -f lavfi -i "movie=$f,signalstats" -show_entries frame_tags=lavfi.signalstats.YAVG -of csv=p=0 -read_intervals "%+#1" | tr -d ',')
  # guard: an empty/failed probe must not silently pass (awk coerces "" to 0, and 0 < 4 is true).
  [ -n "$mean" ] || { echo "  ✗ could not read first-frame luma"; fail=1; continue; }
  echo "  first-frame YAVG=$mean"
  awk -v m="$mean" 'BEGIN{ exit !(m < 4) }' || { echo "  ✗ first frame not black"; fail=1; }
done
exit $fail
