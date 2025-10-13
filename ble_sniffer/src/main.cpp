#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <esp_wifi.h>

// WiFi credentials for connecting to internet (Station mode)
const char* ssid = "Ak";
const char* password = "Akshay@9";

// Access Point credentials
const char* ap_ssid = "BE_Attendance";
const char* ap_password = ""; // No password (open network)

const char* serverUrl = "https://b968jkbl-5000.inc1.devtunnels.ms/api/attendance";

WebServer server(80);
bool isScanning = false;

std::vector<String> deviceList;

// Function declarations
void getConnectedDevices();

void setupAccessPoint() {
  WiFi.softAP(ap_ssid, ap_password);
}

void connectWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
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

    http.end();
  }
}

void handleRoot() {
  server.send(200, "text/html", 
    "<html><body>"
    "<h1>ESP32 Attendance System</h1>"
    "<p>AP: BE_Attendance (Open)</p>"
    "<p>POST to /api/start-attendance to collect attendance</p>"
    "</body></html>");
}

void handleStartAttendance() {
  server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Attendance collection started\"}");
  getConnectedDevices();
}

void handleNotFound() {
  server.send(404, "text/plain", "Not Found");
}

void getConnectedDevices() {
  if (isScanning) {
    return;
  }
  
  isScanning = true;
  deviceList.clear();

  wifi_sta_list_t stationList;
  esp_wifi_ap_get_sta_list(&stationList);

  for (int i = 0; i < stationList.num; i++) {
    char macStr[18];
    snprintf(macStr, sizeof(macStr), "%02x:%02x:%02x:%02x:%02x:%02x",
             stationList.sta[i].mac[0], stationList.sta[i].mac[1],
             stationList.sta[i].mac[2], stationList.sta[i].mac[3],
             stationList.sta[i].mac[4], stationList.sta[i].mac[5]);
    
    deviceList.push_back(String(macStr));
  }

  sendDevicesToServer();
  
  isScanning = false;
}

void setupWebServer() {
  server.on("/", HTTP_GET, handleRoot);
  server.on("/api/start-attendance", HTTP_POST, handleStartAttendance);
  server.on("/api/start-attendance", HTTP_GET, []() {
    server.send(405, "application/json", "{\"error\":\"Method Not Allowed. Use POST\"}");
  });
  server.onNotFound(handleNotFound);
  server.begin();
}

void setup() {
  WiFi.mode(WIFI_AP_STA);
  setupAccessPoint();
  connectWiFi();
  setupWebServer();
}

void loop() {
  server.handleClient();
  delay(10);
}
