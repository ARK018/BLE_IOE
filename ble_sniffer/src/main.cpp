#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <NimBLEDevice.h>
#include <NimBLEScan.h>
#include <NimBLEAdvertisedDevice.h>

const char* ssid = "Akshay";
const char* password = "Akshay@9";

const char* serverUrl = "https://b968jkbl-5000.inc1.devtunnels.ms/api/attendance";

WebServer server(80);
BLEScan* pBLEScan;
int currentScanTime = 5; // Default scan time in seconds
bool isScanning = false;

std::vector<String> deviceList;

// Function declarations
void runScan();

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks {
public:
  void onResult(NimBLEAdvertisedDevice* advertisedDevice) override {
    // Print the advertised device info to serial (or handle as needed)
    Serial.println(advertisedDevice->toString().c_str());
    deviceList.push_back(String(advertisedDevice->getAddress().toString().c_str()));
  }
};

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected");
  Serial.println(WiFi.localIP());
}

void sendDevicesToServer() {
  if (WiFi.status() == WL_CONNECTED && !deviceList.empty()) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{ \"devices\": [";
    for (size_t i = 0; i < deviceList.size(); i++) {
      payload += "\"" + deviceList[i] + "\"";
      if (i < deviceList.size() - 1) payload += ",";
    }
    payload += "] }";

    int httpResponseCode = http.POST(payload);

    Serial.print("POST Response Code: ");
    Serial.println(httpResponseCode);
    Serial.println("Payload: " + payload);

    http.end();
  } else {
    Serial.println("WiFi not connected or no devices found.");
  }
}

void handleStartAttendance() {
  Serial.println("Received /api/start-attendance request");
  
  if (server.hasArg("scanTime")) {
    currentScanTime = server.arg("scanTime").toInt();
    if (currentScanTime <= 0) {
      currentScanTime = 5; // Default fallback
    }
  }
  
  Serial.print("Starting attendance scan with scanTime: ");
  Serial.println(currentScanTime);
  
  // Send response immediately
  server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Attendance scan started\",\"scanTime\":" + String(currentScanTime) + "}");
  
  // Start the scan
  runScan();
}

void handleNotFound() {
  server.send(404, "text/plain", "Not Found");
}

void runScan() {
  if (isScanning) {
    Serial.println("Scan already in progress...");
    return;
  }
  
  isScanning = true;
  Serial.println("\nScanning BLE devices...");
  deviceList.clear();

  pBLEScan->start(currentScanTime, false);
  pBLEScan->stop();

  sendDevicesToServer();
  
  Serial.println("Scan completed.");
  isScanning = false;
}

void setupWebServer() {
  server.on("/api/start-attendance", HTTP_POST, handleStartAttendance);
  server.onNotFound(handleNotFound);
  
  server.begin();
  Serial.println("Web server started");
  Serial.print("Server available at: http://");
  Serial.println(WiFi.localIP());
  Serial.println("Endpoint: POST /api/start-attendance");
}


void setup() {
  Serial.begin(115200);
  connectWiFi();

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); // more info but more power usage

  setupWebServer();

  Serial.println("BLE Scanner initialized.");
  Serial.println("Send POST request to /api/start-attendance to start scanning");
  Serial.println("POST body parameter: scanTime (in seconds)");
}

void loop() {
  server.handleClient();
  delay(10); // Small delay to prevent watchdog issues
}
