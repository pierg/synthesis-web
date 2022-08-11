echo "...activating conda env..."
source ./venv/bin/activate
if [ $# -eq 0 ]
  then
    echo "No parameters provided. Launching bash"
    exec bash
    bash
else
    while test $# -gt 0; do
      case "$1" in
        -h|--help)
          echo "options:"
          echo "-h, --help                show brief help"
          exit 0
          ;;
        -b)
          echo "Launch backend server"
          python3 ./src/backend/app.py
          ;;
        -s)
          echo "Launch backend server with serving"
          python3 ./src/backend/app.py --serve=True
          ;;
        -d)
          echo "Build and deploy..."
          cd ./frontend
          npm run deploy
          cd ../
          python3 ./src/backend/app.py
          ;;
        *)
          break
          ;;
      esac
    done
fi
