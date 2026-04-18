# NOVAFLUX - Smart Grid Central Intelligence System

NOVAFLUX is a comprehensive smart grid management and monitoring system that provides real-time control, monitoring, and analytics for electrical distribution networks.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NOVAFLUX System                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐      ┌─────────────────┐             │
│  │   MCP Backend    │      │   UI Dashboard   │             │
│  │   (Port 3000)   │◄────►│   (Port 8080)    │             │
│  └────────┬────────┘      └────────┬────────┘             │
│           │                         │                         │
│           ▼                         ▼                         │
│  ┌─────────────────┐      ┌─────────────────┐             │
│  │  PostgreSQL    │      │    Browser      │             │
│  │   Database    │      │   (React UI)   │             │
│  └────────┬────────┘      └─────────────────┘             │
│           │                                                 │
│           ▼                                                 │
│  ┌─────────────────┐                                       │
│  │    Redis       │                                       │
│  │  (Cache/Queue)│                                       │
│  └─────────────────┘                                       │
└──────────────────────────────────────────────────────────────┘
```

## System Components

### 1. MCP Backend (`src/index.js`)
- **Port**: 3000
- **Framework**: Express.js with Socket.IO
- **Purpose**: RESTful API + WebSocket for real-time updates

### 2. UI Dashboard (`novaflux-ui/`)
- **Port**: 8080
- **Framework**: React + Vite + Tailwind CSS
- **Purpose**: Visual interface for grid monitoring

### 3. Database Layer
- **PostgreSQL**: Primary data store (meters, users, billing, etc.)
- **Redis**: Caching and real-time message queue

## Key Features

### Grid Monitoring
- Real-time substation and transformer status
- Power flow analysis
- Grid health metrics
- Regional distribution overview

### Meter Management
- Smart meter registration and tracking
- Remote connect/disconnect capabilities
- Usage analytics and statistics
- Historical reading retrieval

### Theft Detection
- Pattern-based anomaly detection
- Non-technical loss identification
- Alert generation for suspicious activity

### Load Management
- Demand response automation
- Load shedding events
- Peak demand tracking
- Load balancing recommendations

### Forecasting
- Demand forecasting by region
- Peak prediction
- Renewable energy production forecasting
- Optimal renewable mix calculation

### Billing System
- Automatic bill generation
- Payment processing
- Revenue analytics
- Billing history management

### Outage Management
- Outage reporting and tracking
- Restoration management
- Outage statistics
- Automatic resolution workflows

### Renewable Energy
- Solar/wind/hydro source tracking
- Production forecasting
- Optimal mix optimization

## Data Collection Methods

### 1. MQTT Integration
The system integrates with MQTT brokers to receive real-time meter data:
```
MQTT Topics:
├── meters/{meterId}/readings     # Power consumption data
├── meters/{meterId}/status      # Connection status
├── transformers/{id}/load      # Transformer load data
└── substations/{id}/voltage     # Voltage levels
```

### 2. REST API Ingestion
External systems can push data via REST endpoints:
- `POST /api/meters/{id}/readings` - Submit meter readings
- `POST /api/grid/status` - Push grid status updates

### 3. WebSocket Real-time
Socket.IO connections for live updates:
```javascript
io.emit('meter-update', { meterId, consumption, timestamp });
io.emit('alert', { type, severity, message });
io.emit('outage', { regionId, status, affectedMeters });
```

### 4. Database Models
- **Meter**: Smart meter records
- **Reading**: Historical consumption data
- **Transformer**: transformer equipment
- **Substation**: Substation data
- **Region**: Geographic regions
- **User**: System users (admin, operators)
- **Billing**: Billing records
- **Alert**: System alerts
- **Outage**: Outage events
- **RenewableSource**: Solar/wind/hydro sources

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/auth/me | Get current user |

### Meters
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/meters | List all meters |
| GET | /api/meters/:id | Get meter details |
| POST | /api/meters | Create new meter |
| POST | /api/meters/:id/readings | Submit readings |
| POST | /api/meters/:id/disconnect | Remote disconnect |
| POST | /api/meters/:id/reconnect | Remote reconnect |

### Grid
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/grid/status | Full grid status |
| GET | /api/grid/region/:id | Region details |
| GET | /api/grid/substation/:id | Substation details |
| GET | /api/grid/transformer/:id | Transformer details |

### Billing
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/billing/generate | Generate bill |
| GET | /api/billing/meter/:id | Meter bills |
| POST | /api/billing/:id/pay | Process payment |
| GET | /api/billing/revenue | Revenue stats |

### Forecasts
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/forecast/demand/:regionId | Demand forecast |
| GET | /api/forecast/peak/:regionId | Peak prediction |
| GET | /api/forecast/distribution | Load distribution |

### Other Endpoints
- `/api/alerts` - Alert management
- `/api/outages` - Outage tracking
- `/api/renewables` - Renewable sources
- `/api/regions` - Geographic regions
- `/api/theft/detect` - Theft detection

## Advantages

### 1. Real-time Monitoring
- WebSocket-based live updates
- Sub-second data refresh
- Instant alert notifications

### 2. Scalability
- Redis caching for high performance
- MQTT for efficient IoT data ingestion
- Horizontal scaling support

### 3. Comprehensive APIs
- RESTful design
- JWT authentication
- Role-based access control

### 4. Automated Operations
- Automatic billing generation
- Predictive maintenance alerts
- Automated load management
- Theft anomaly detection

### 5. Modern UI
- Responsive React interface
- Real-time dashboard updates
- Dark mode support
- Interactive visualizations

### 6. Integration Ready
- MQTT support for IoT devices
- WebSocket for real-time apps
- REST API for external systems

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install
cd novaflux-ui && npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start the system
./novaflux-start.command
```

### Access
- Dashboard: http://127.0.0.1:8080
- API: http://127.0.0.1:3000/api
- Default login: admin@novaflux.com / admin123

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js, Express.js |
| Real-time | Socket.IO |
| Database | PostgreSQL, Sequelize |
| Cache/Queue | Redis, ioredis |
| IoT Protocol | MQTT |
| Authentication | JWT, bcryptjs |
| UI Framework | React, Vite |
| Styling | Tailwind CSS |
| State Management | React Query |
| Routing | React Router |

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Helmet for HTTP headers
- CORS configuration
- Role-based access control

## License

Private - All rights reserved