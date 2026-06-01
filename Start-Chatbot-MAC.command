#!/bin/bash
# ============================================================
#  Sreeja's AI Chatbot — One-click start (macOS)
#  Just double-click this file. First run takes a minute.
# ============================================================
cd "$(dirname "$0")"

echo ""
echo "  🤖  Starting Sreeja's AI Chatbot..."
echo "  ----------------------------------------------------"

# Check Node.js is installed
if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  ❌  Node.js is not installed."
  echo "      Please install it (free) from:  https://nodejs.org"
  echo "      Download the 'LTS' version, install it, then run this again."
  echo ""
  read -p "  Press Enter to close..."
  exit 1
fi

echo "  📦  Installing pieces (first time only, please wait)..."
( cd backend  && npm install --silent )
( cd frontend && npm install --silent )

echo "  🚀  Launching..."
( cd backend  && npm run dev ) &
BACK=$!
( cd frontend && npm run dev ) &
FRONT=$!

sleep 5
echo ""
echo "  ✅  Ready! Opening the chatbot in your browser..."
echo "      If it doesn't open, go to:  http://localhost:5173"
echo ""
echo "  ⛔  To STOP the chatbot, just close this window."
open http://localhost:5173

# Keep running until the window is closed
trap "kill $BACK $FRONT 2>/dev/null" EXIT
wait
