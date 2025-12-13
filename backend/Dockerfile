FROM python:3.11-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --no-dev

# Copy the rest of the application
COPY backend/ .

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Use the virtual environment
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Run the application
CMD ["fastapi", "run", "app/main.py", "--port", "8000", "--host", "0.0.0.0"]
