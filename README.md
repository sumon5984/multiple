# Overview

KAISEN-MD is a feature-rich WhatsApp bot built on Node.js using the Baileys library. The bot provides automated messaging capabilities, group management features, content download functionality, and various utility commands. It's designed to operate in both private and public modes with comprehensive session management and multi-instance support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
The application follows a modular plugin-based architecture with the following core components:

- **Main Server (index.js)**: Express.js server managing bot instances and session handling
- **Client Management (lib/client.js)**: WhatsApp connection handler using Baileys WebSocket API
- **Plugin System (plugins/)**: Modular command system with hot-loading capabilities
- **Database Layer (lib/database.js)**: Sequelize ORM for data persistence
- **Session Management**: Multi-file authentication state with automatic session recovery

## Key Architectural Decisions

### Plugin Architecture
The bot uses a dynamic plugin system where each command is a separate module. Plugins are auto-loaded from the `/plugins` directory and can be installed/uninstalled at runtime. This design provides excellent modularity and maintainability.

### Session Management
Multi-session support allows running multiple bot instances simultaneously. Sessions are stored both in files and database for redundancy. The system includes automatic session recovery from MEGA.nz URLs for deployment flexibility.

### Message Processing Pipeline
Messages flow through multiple processing layers:
1. Authentication and validation
2. Command parsing and routing
3. Permission checking (admin, owner, group-specific)
4. Plugin execution
5. Response formatting and delivery

### Group Management Features
Comprehensive group administration including:
- Auto-moderation (antilink, antiword)
- Welcome/goodbye messages
- Admin-only command restrictions
- Automated member management

## Core Technologies

- **Runtime**: Node.js with PM2 process management
- **WebSocket Library**: @whiskeysockets/baileys for WhatsApp Web API
- **Database**: Sequelize ORM with PostgreSQL support
- **Media Processing**: FFmpeg for audio/video conversion
- **HTTP Client**: Axios for external API calls
- **File Handling**: fs-extra for enhanced file operations

## Data Management

### Database Schema
Uses Sequelize models for:
- Session storage and management
- User preferences and settings
- Group-specific configurations
- Command filters and automation rules

### Media Handling
Temporary file management in `/media` directory with automatic cleanup. Supports multiple media formats with conversion capabilities using FFmpeg.

## Security Features

- **Permission System**: Multi-level access control (public, admin, owner, developer)
- **Rate Limiting**: Built-in spam protection and cooldown mechanisms
- **Input Validation**: Sanitized command parameters and media type checking
- **Session Security**: Encrypted session storage with automatic token refresh

## Configuration Management

Environment-based configuration system supporting:
- Development and production modes
- Feature toggles for different functionalities
- API key management for external services
- Deployment-specific settings (Heroku, Railway, etc.)

# External Dependencies

## Core WhatsApp Integration
- **@whiskeysockets/baileys**: Primary WhatsApp Web API library for message handling and WebSocket communication

## Database and ORM
- **sequelize**: Object-relational mapping for database operations
- **pg**: PostgreSQL driver for production database connectivity
- **sqlite3**: Local database for development and testing

## Media Processing
- **@ffmpeg-installer/ffmpeg**: Cross-platform FFmpeg binary installation
- **fluent-ffmpeg**: FFmpeg wrapper for audio/video processing
- **jimp**: Image manipulation and processing
- **node-webpmux**: WebP format handling for stickers

## External APIs
- **axios**: HTTP client for external API communications
- **@distube/ytdl-core**: YouTube content downloading
- **google-tts-api**: Text-to-speech conversion
- **openai**: AI chatbot integration

## Development and Deployment
- **pm2**: Production process management
- **dotenv**: Environment variable management
- **heroku-client**: Heroku platform integration
- **simple-git**: Git operations for auto-updates

## Utility Libraries
- **moment-timezone**: Time zone handling and formatting
- **awesome-phonenumber**: Phone number validation and formatting
- **qrcode-reader**: QR code scanning capabilities
- **node-cron**: Scheduled task management

## File Processing
- **file-type**: MIME type detection
- **form-data**: Multipart form data handling
- **megajs**: MEGA.nz cloud storage integration
- **cheerio**: HTML parsing for web scraping

The application integrates with numerous external APIs for functionality like weather data, image search, meme generation, and content downloading, making it highly dependent on network connectivity and third-party service availability.
