#!/bin/bash

echo "🚀 Starting ADHD Task Manager Web Development Environment"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the task-manager-web directory"
    exit 1
fi

# Check if task-manager API is running
echo "🔍 Checking if Task Manager API is running..."
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "⚠️  Task Manager API is not running on localhost:8000"
    echo ""
    echo "Please start the backend first:"
    echo "  cd ../task-manager"
    echo "  source bin/activate"
    echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
    echo ""
    echo "Then come back and run this script again."
    exit 1
fi

echo "✅ Task Manager API is running"
echo "🌐 Starting Next.js development server..."
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API running at: http://localhost:8000"
echo ""

npm run dev
