import { emojify } from 'node-emoji';
import winston from 'winston';


// Create a custom formatter with improved readability
const myFormat = winston.format.printf((info) => {
  let emojiToLog = '';
  switch (info.level) {
    case 'info':
      emojiToLog = emojify.get('white_check_mark');
      break;
    case 'error':
      emojiToLog = emojify.get('x');
      break;
    default:
      emojiToLog = ''; // Handle other log levels (optional)
  }
  return (
    `[${info.timestamp}] ${emojiToLog} [${info.level}]: ${info.message}` +
    (info.splat !== undefined ? `${info.splat}` : ' ')
  );
});

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    myFormat, // Use the custom formatter
  ),
});

export default logger; // Export the logger as default