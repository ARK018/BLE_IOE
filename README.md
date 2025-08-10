# BLE IOE - Bluetooth Low Energy Attendance System

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Platform](https://img.shields.io/badge/Platform-ESP32-orange)

A comprehensive IoT-based attendance management system that leverages Bluetooth Low Energy (BLE) technology for automatic attendance tracking. The system consists of an ESP32 BLE scanner, a Node.js backend server, and a React.js frontend dashboard.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Hardware Requirements](#hardware-requirements)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

The BLE IOE Attendance System is designed to automate attendance tracking in educational institutions or corporate environments. Students/employees carry BLE-enabled devices (smartphones, smartwatches, or dedicated BLE beacons), and the system automatically detects their presence when they enter the scanning range.

### How It Works

1. **Detection**: ESP32 device scans for BLE devices in the vicinity
2. **Processing**: Detected device MAC addresses are sent to the server
3. **Verification**: Server matches MAC addresses with registered students/employees
4. **Recording**: Attendance records are stored in MongoDB database
5. **Visualization**: React dashboard displays real-time attendance data

## ✨ Features

### Core Features

- **Automatic BLE Device Detection**: Real-time scanning of Bluetooth devices
- **Manual Attendance Override**: Ability to manually mark attendance
- **Student/Teacher Management**: CRUD operations for user management
- **Real-time Dashboard**: Live attendance monitoring and statistics
- **RESTful API**: Complete backend API for all operations
- **Responsive UI**: Mobile-friendly React interface

### Advanced Features

- **Configurable Scan Time**: Adjustable scanning duration (1-60 seconds)
- **Duplicate Prevention**: Prevents multiple attendance entries for the same session
- **Statistical Analysis**: Daily, weekly, and monthly attendance reports
- **Device Registration**: Bluetooth MAC address registration for students
- **Remote Control**: Web-based interface to control ESP32 scanner

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/WiFi    ┌─────────────────┐    RESTful API    ┌─────────────────┐
│                 │ ───────────────► │                 │ ─────────────────► │                 │
│   ESP32 BLE     │                 │   Node.js       │                   │   React.js      │
│   Scanner       │                 │   Backend       │                   │   Frontend      │
│                 │ ◄─────────────── │                 │ ◄───────────────── │                 │
└─────────────────┘                 └─────────────────┘                   └─────────────────┘
        │                                    │                                    │
        │ BLE Scanning                       │ Database Operations                │ User Interface
        ▼                                    ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐                 ┌─────────────────┐
│                 │                 │                 │                 │                 │
│  BLE Devices    │                 │   MongoDB       │                 │   Web Browser   │
│  (Smartphones,  │                 │   Database      │                 │   (Dashboard)   │
│  Beacons, etc.) │                 │                 │                 │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

## 📁 Project Structure

```
BLE_IOE/
│
├── README.md                          # Project documentation
│
├── ble_sniffer/                       # ESP32 Firmware
│   ├── platformio.ini                 # PlatformIO configuration
│   ├── src/
│   │   └── main.cpp                   # Main ESP32 code
│   ├── include/                       # Header files
│   ├── lib/                          # Custom libraries
│   └── test/                         # Test files
│
├── server/                           # Node.js Backend
│   ├── package.json                  # Server dependencies
│   ├── server.js                     # Main server file
│   ├── models/                       # MongoDB models
│   │   ├── Student.js                # Student schema
│   │   ├── Teacher.js                # Teacher schema
│   │   └── Attendance.js             # Attendance schema
│   └── routes/                       # API routes
│       ├── student.js                # Student endpoints
│       ├── teacher.js                # Teacher endpoints
│       └── attendance.js             # Attendance endpoints
│
└── client/                          # React.js Frontend
    ├── package.json                 # Client dependencies
    ├── index.html                   # Main HTML file
    ├── vite.config.js              # Vite configuration
    ├── src/
    │   ├── App.jsx                  # Main App component
    │   ├── main.jsx                 # React entry point
    │   ├── index.css                # Global styles
    │   ├── components/              # React components
    │   │   ├── Navigation.jsx       # Navigation bar
    │   │   ├── Dashboard.jsx        # Main dashboard
    │   │   ├── students/            # Student components
    │   │   │   └── StudentList.jsx
    │   │   ├── teachers/            # Teacher components
    │   │   │   └── TeacherList.jsx
    │   │   └── attendance/          # Attendance components
    │   │       └── AttendanceManagement.jsx
    │   ├── services/                # API services
    │   │   └── api.js               # API utility functions
    │   └── assets/                  # Static assets
    └── public/                      # Public assets
```

## 🛠️ Technology Stack

### Hardware

- **ESP32 Development Board**: Main microcontroller
- **WiFi Module**: Built-in ESP32 WiFi capability
- **BLE Module**: Built-in ESP32 Bluetooth Low Energy

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend

- **React.js**: UI library
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

### Firmware

- **PlatformIO**: Development platform
- **Arduino Framework**: ESP32 programming framework
- **NimBLE**: Bluetooth Low Energy library
- **WiFi Library**: ESP32 WiFi management
- **HTTPClient**: HTTP communication
- **WebServer**: ESP32 web server

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- PlatformIO IDE or Arduino IDE
- ESP32 development board
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BLE_IOE.git
cd BLE_IOE
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ble_attendance
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

### 4. ESP32 Firmware Setup

1. Open the `ble_sniffer` folder in PlatformIO
2. Connect your ESP32 to your computer
3. Update WiFi credentials in `main.cpp`:
   ```cpp
   const char* ssid = "Your_WiFi_SSID";
   const char* password = "Your_WiFi_Password";
   ```
4. Update server URL in `main.cpp`:
   ```cpp
   const char* serverUrl = "http://your-server-ip:5000/api/attendance";
   ```
5. Upload the firmware to ESP32:
   ```bash
   pio run --target upload
   ```

## ⚙️ Configuration

### ESP32 Configuration

- **WiFi Settings**: Update SSID and password in `main.cpp`
- **Server URL**: Configure backend server endpoint
- **Scan Parameters**: Modify BLE scan settings if needed

### Server Configuration

- **Port**: Configure server port in `.env` file
- **Database**: Set MongoDB connection string
- **CORS**: Adjust CORS settings for production

### Frontend Configuration

- **API Base URL**: Update in `src/services/api.js`
- **Styling**: Customize Tailwind CSS configuration

## 📖 Usage

### Starting the System

1. **Start MongoDB**: Ensure MongoDB is running
2. **Start Backend**: `npm run dev` in server directory
3. **Start Frontend**: `npm run dev` in client directory
4. **Power ESP32**: Connect and power on the ESP32 device

### Using the Dashboard

1. **Access Dashboard**: Open `http://localhost:5173` in your browser
2. **Manage Students**: Add students with their Bluetooth MAC addresses
3. **Start Attendance**: Use the "Start Attendance Scan" button
4. **View Records**: Monitor real-time attendance in the dashboard

### Attendance Workflow

1. **Automatic Mode**:

   - Click "Start Attendance Scan"
   - Set scan duration (1-60 seconds)
   - ESP32 scans for BLE devices
   - Attendance is automatically recorded

2. **Manual Mode**:
   - Enter Bluetooth MAC addresses manually
   - Useful for troubleshooting or backup

## 📡 API Documentation

### Attendance Endpoints

#### Start Attendance Scan

```http
POST /api/start-attendance
Content-Type: application/json

{
  "scanTime": 10
}
```

#### Mark Attendance

```http
POST /api/attendance
Content-Type: application/json

{
  "devices": ["3C:B0:ED:44:39:14", "AA:BB:CC:DD:EE:FF"]
}
```

#### Get Attendance Records

```http
GET /api/attendance
```

### Student Endpoints

#### Create Student

```http
POST /api/students
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "bluetoothId": "3C:B0:ED:44:39:14",
  "password": "password123"
}
```

#### Get All Students

```http
GET /api/students
```

### Teacher Endpoints

#### Create Teacher

```http
POST /api/teachers
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```

## 🔧 Hardware Requirements

### Essential Components

- **ESP32 Development Board**: Any ESP32 variant with WiFi and BLE
- **Power Supply**: USB cable or 3.3V/5V power adapter
- **Antenna**: Built-in PCB antenna (sufficient for most applications)

## 🔍 Troubleshooting

### Common Issues

#### ESP32 Not Connecting to WiFi

- Check SSID and password in code
- Ensure WiFi network is 2.4GHz
- Verify network accessibility
- Check serial monitor for error messages

#### BLE Devices Not Detected

- Ensure target devices have Bluetooth enabled
- Check BLE advertising settings
- Verify scan parameters
- Test with known BLE devices

#### Server Connection Issues

- Verify server is running on correct port
- Check firewall settings
- Ensure ESP32 and server are on same network
- Validate API endpoints

#### Database Connection Problems

- Confirm MongoDB is running
- Check connection string in `.env`
- Verify database permissions
- Test database connectivity

### Debug Commands

#### ESP32 Serial Monitor

```bash
pio device monitor
```

#### Server Logs

```bash
npm run dev
```

#### Test API Endpoints

```bash
curl -X POST http://localhost:5000/api/start-attendance \
  -H "Content-Type: application/json" \
  -d '{"scanTime": 5}'
```
