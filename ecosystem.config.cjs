module.exports = {
  apps: [
    {
      name: 'moksh-backend-production',
      script: 'npm',
      args: 'run start',
      cwd: './backend',
      instances: 'max', // Scale across all available CPU cores
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './backend/logs/pm2-error.log',
      out_file: './backend/logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
