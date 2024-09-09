module.exports = {
    apps: [
        {
            name: 'nusa-be-9000',
            script: 'dist/src/main.js',
            instances: 1, // Set to 1 for a single instance, or -1 for cluster mode with auto-scaling
            exec_mode: 'cluster', // Use cluster mode if you want multiple instances
            autorestart: true,
            max_restarts: 10, // Maximum restart attempts
            kill_timeout: 10000, // Timeout in milliseconds (10 seconds)
            log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
            env: {
                PORT: 9000, // Define the port here as an environment variable
                NODE_ENV: 'production', // Set environment to production
            },
        },
    ],
};
