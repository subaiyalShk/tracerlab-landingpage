#!/usr/bin/env bash
# Render the four hero compositions (dark/light × landscape/portrait), encode to the
# site's budget (with the score as AAC 96k), and verify.
#   bash scripts/encode-hero.sh            # all four
#   ONLY=light bash scripts/encode-hero.sh # render/encode just the light pair (verify all)
# Dev affordance: VERIFY_ONLY=1 bash scripts/encode-hero.sh skips the render+encode section and
# re-runs only the verification loop against the already-committed public/hero/*.mp4 files.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ "${VERIFY_ONLY:-0}" != "1" ]; then
  cd "$ROOT/video"

  if [ "${ONLY:-all}" != "light" ]; then
    npx remotion render HeroLoop out/hero-16x9-master.mp4 --codec h264 --crf 12
    npx remotion render HeroLoopMobile out/hero-9x16-master.mp4 --codec h264 --crf 12
  fi
  if [ "${ONLY:-all}" != "dark" ]; then
    npx remotion render HeroLoopLight out/hero-16x9-light-master.mp4 --codec h264 --crf 12
    npx remotion render HeroLoopMobileLight out/hero-9x16-light-master.mp4 --codec h264 --crf 12
  fi

  mkdir -p "$ROOT/public/hero"
  enc() { # in out scale crf
    ffmpeg -y -i "$1" -vf "scale=$3,format=yuv420p" -c:v libx264 -preset slow -crf "$4" -g 90 -pix_fmt yuv420p -c:a aac -b:a 96k -ac 2 -movflags +faststart "$2"
  }
  # crf 26 dark / 27 light: the film's thin strokes and small chip text shimmer
  # at 28–29 (seen on phones); the map is out for most of the run now, so the
  # files stay well inside the 2.5 MB budget. Light frames (pastel dots on
  # grey) still compress a little worse, hence +1.
  if [ "${ONLY:-all}" != "light" ]; then
    enc out/hero-16x9-master.mp4 "$ROOT/public/hero/loop-16x9.mp4" 1280:720 26
    enc out/hero-9x16-master.mp4 "$ROOT/public/hero/loop-9x16.mp4"  720:1280 26
  fi
  if [ "${ONLY:-all}" != "dark" ]; then
    enc out/hero-16x9-light-master.mp4 "$ROOT/public/hero/loop-16x9-light.mp4" 1280:720 27
    enc out/hero-9x16-light-master.mp4 "$ROOT/public/hero/loop-9x16-light.mp4"  720:1280 27
  fi
fi

cd "$ROOT"
fail=0
for f in public/hero/loop-16x9.mp4 public/hero/loop-9x16.mp4 public/hero/loop-16x9-light.mp4 public/hero/loop-9x16-light.mp4; do
  size=$(stat -f%z "$f")
  echo "$f: $size bytes"
  [ "$size" -le 2621440 ] || { echo "  ✗ over 2.5 MB"; fail=1; }
  # exactly one video + one audio stream (the score; the site plays muted until the
  # visitor opts in). An empty probe is distinguishable from a missing stream.
  streams=$(ffprobe -v error -show_entries stream=codec_type -of csv=p=0 "$f")
  [ -n "$streams" ] || { echo "  ✗ could not read streams"; fail=1; continue; }
  [ "$(echo "$streams" | grep -c audio)" = "1" ] || { echo "  ✗ expected one audio stream"; fail=1; }
  # faststart: moov atom appears before mdat in the byte stream (equivalent to the trace-parse
  # check; hardened per task-11 resolution notes to avoid relying on `ffprobe -v trace` output
  # formatting).
  moov_off=$(grep -abo "moov" "$f" | head -1 | cut -d: -f1)
  mdat_off=$(grep -abo "mdat" "$f" | head -1 | cut -d: -f1)
  if [ -z "$moov_off" ] || [ -z "$mdat_off" ] || [ "$moov_off" -ge "$mdat_off" ]; then
    echo "  ✗ moov not first (moov=$moov_off mdat=$mdat_off)"; fail=1;
  fi
  # first frame is the flat page background: dark files black (mean luma < 4/255), light
  # files page grey #eef0f4 (mean luma well above 200/255 — the exact value depends on the
  # encoder's range signalling, so the check is "unmistakably light", not a precise match).
  # hardened per task-11 resolution notes: read the YAVG tag directly from signalstats via the
  # lavfi movie source instead of parsing ffmpeg's metadata=print log text.
  mean=$(ffprobe -v error -f lavfi -i "movie=$f,signalstats" -show_entries frame_tags=lavfi.signalstats.YAVG -of csv=p=0 -read_intervals "%+#1" | tr -d ',')
  # guard: an empty/failed probe must not silently pass (awk coerces "" to 0, and 0 < 4 is true).
  [ -n "$mean" ] || { echo "  ✗ could not read first-frame luma"; fail=1; continue; }
  echo "  first-frame YAVG=$mean"
  case "$f" in
    *-light.mp4) awk -v m="$mean" 'BEGIN{ exit !(m > 200) }' || { echo "  ✗ first frame not page-grey"; fail=1; } ;;
    *)           awk -v m="$mean" 'BEGIN{ exit !(m < 4) }'   || { echo "  ✗ first frame not black"; fail=1; } ;;
  esac
done
exit $fail
