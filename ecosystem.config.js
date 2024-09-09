module.exports = {
    apps: [
      {
        name: 'nusa-be-9000',
        script: 'dist/src/main.js',
        instances: 1,
        autorestart: true,
        max_restarts: 10, // Maximum restart attempts
        kill_timeout: 10000, // Timeout in milliseconds (10 seconds)
        args: ['--port', '9000'],
        log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
      },
    ],
  };