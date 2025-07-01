#!/bin/sh

# Create a temporary file for environment variables
> /app/frontend/build/env.js

# Add assignment for REACT_APP_BACKEND_URL
echo "window.env = {\"REACT_APP_BACKEND_URL\": \"$REACT_APP_BACKEND_URL\"};" >> /app/frontend/build/env.js

