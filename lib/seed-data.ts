import { addComponent, addScenario, setScenarioComponents, getAllComponents, initializeDatabase } from './db';
import { getComponentDocumentation } from './component-docs';

export const components = [
  { id: 1, name: "Micro SD Card (32GB)", description: "32GB Micro SD Card for data storage", pinout: "Standard SD interface - VCC, GND, MISO, MOSI, SCK, CS", category: "Storage", quantity: 10, code_snippet: `// Micro SD Card with Arduino
#include <SPI.h>
#include <SD.h>

const int chipSelect = 10;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(chipSelect)) {
    Serial.println("Card failed!");
    return;
  }
  Serial.println("Card initialized.");
}

void loop() {
  File dataFile = SD.open("datalog.txt", FILE_WRITE);
  if (dataFile) {
    dataFile.println("Hello World!");
    dataFile.close();
  }
}` },
  { id: 2, name: "Card Reader RDF5 (Transcend) - USB 3.1 Gen 1", description: "USB 3.1 Gen 1 Card Reader for SD cards", pinout: "USB interface", category: "Interface", quantity: 10, code_snippet: `// USB Card Reader - Used externally with PC
// No Arduino code required - plug into USB port` },
  { id: 3, name: "Small Servo Motor", description: "9g micro servo motor for precise angular control", pinout: "Orange: Signal (PWM), Red: VCC (5V), Brown: GND", category: "Actuator", quantity: 10, code_snippet: `// Small Servo Motor Control
#include <Servo.h>

Servo myservo;
int pos = 0;

void setup() {
  myservo.attach(9);  // Servo on pin 9
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (pos = 0; pos <= 180; pos += 1) {
    myservo.write(pos);
    delay(15);
  }
  // Sweep back
  for (pos = 180; pos >= 0; pos -= 1) {
    myservo.write(pos);
    delay(15);
  }
}` },
  { id: 4, name: "DC Motor 5V", description: "5V DC motor for continuous rotation", pinout: "Two terminals: Motor+ and Motor-", category: "Actuator", quantity: 20, code_snippet: `// DC Motor Control with Transistor
const int motorPin = 9;

void setup() {
  pinMode(motorPin, OUTPUT);
}

void loop() {
  // Motor ON
  analogWrite(motorPin, 200);  // PWM speed control
  delay(2000);
  // Motor OFF
  analogWrite(motorPin, 0);
  delay(1000);
}` },
  { id: 5, name: "Piezo Capsule", description: "Piezoelectric buzzer/speaker for sound output", pinout: "Positive (+), Negative (-)", category: "Output", quantity: 20, code_snippet: `// Piezo Buzzer Tones
const int buzzerPin = 8;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  // Play tone at 1000Hz for 500ms
  tone(buzzerPin, 1000, 500);
  delay(1000);
  // Play tone at 2000Hz for 500ms
  tone(buzzerPin, 2000, 500);
  delay(1000);
}` },
  { id: 6, name: "Photo Resistor LDR", description: "Light Dependent Resistor for light sensing", pinout: "Two terminals (no polarity) - use with 10K resistor as voltage divider", category: "Sensor", quantity: 22, code_snippet: `// LDR Light Sensor
const int ldrPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(ldrPin);
  Serial.print("Light: ");
  Serial.println(lightValue);
  
  if (lightValue < 300) {
    Serial.println("Dark environment");
  } else {
    Serial.println("Bright environment");
  }
  delay(500);
}` },
  { id: 7, name: "Potentiometer 10 kilohm", description: "10K variable resistor for analog input", pinout: "Left: GND, Middle: Signal (A0), Right: VCC", category: "Input", quantity: 15, code_snippet: `// Potentiometer Reading
const int potPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int potValue = analogRead(potPin);  // 0-1023
  int mappedValue = map(potValue, 0, 1023, 0, 255);
  
  Serial.print("Raw: ");
  Serial.print(potValue);
  Serial.print(" Mapped: ");
  Serial.println(mappedValue);
  delay(200);
}` },
  { id: 8, name: "Pushbuttons", description: "Tactile push button switches", pinout: "4 pins - 2 pairs internally connected. Connect one side to GND, other to digital pin with INPUT_PULLUP", category: "Input", quantity: 35, code_snippet: `// Pushbutton with Internal Pull-up
const int buttonPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // LOW when pressed (pull-up configuration)
  if (digitalRead(buttonPin) == LOW) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }
}` },
  { id: 9, name: "LED (Bright White)", description: "High brightness white LED", pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.", category: "Output", quantity: 50, code_snippet: `// White LED Blink
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}` },
  { id: 10, name: "LED (Red)", description: "Standard red LED", pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.", category: "Output", quantity: 50, code_snippet: `// Red LED with PWM Fade
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // Fade in
  for (int i = 0; i <= 255; i++) {
    analogWrite(ledPin, i);
    delay(10);
  }
  // Fade out
  for (int i = 255; i >= 0; i--) {
    analogWrite(ledPin, i);
    delay(10);
  }
}` },
  { id: 11, name: "LED (Green)", description: "Standard green LED", pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.", category: "Output", quantity: 50, code_snippet: `// Green LED Status Indicator
const int greenLed = 10;

void setup() {
  pinMode(greenLed, OUTPUT);
}

void loop() {
  // Blink pattern: 2 short, 1 long
  for (int i = 0; i < 2; i++) {
    digitalWrite(greenLed, HIGH);
    delay(200);
    digitalWrite(greenLed, LOW);
    delay(200);
  }
  digitalWrite(greenLed, HIGH);
  delay(1000);
  digitalWrite(greenLed, LOW);
  delay(500);
}` },
  { id: 12, name: "LED (Yellow)", description: "Standard yellow LED", pinout: "Long leg: Anode (+), Short leg: Cathode (-). Use 220 ohm resistor.", category: "Output", quantity: 50, code_snippet: `// Yellow LED Warning Signal
const int yellowLed = 11;

void setup() {
  pinMode(yellowLed, OUTPUT);
}

void loop() {
  // Fast warning blink
  digitalWrite(yellowLed, HIGH);
  delay(100);
  digitalWrite(yellowLed, LOW);
  delay(100);
}` },
  { id: 13, name: "Transistor", description: "NPN transistor (2N2222 or similar) for switching", pinout: "E: Emitter, B: Base (connect via 1K resistor to Arduino), C: Collector", category: "Electronic", quantity: 50, code_snippet: `// NPN Transistor as Switch for Motor
const int basePin = 9;  // PWM pin through 1K resistor to base

void setup() {
  pinMode(basePin, OUTPUT);
}

void loop() {
  // Turn on transistor (motor runs)
  analogWrite(basePin, 200);
  delay(2000);
  // Turn off transistor (motor stops)
  analogWrite(basePin, 0);
  delay(1000);
}` },
  { id: 14, name: "Capacitors 100nF", description: "100 nanofarad ceramic capacitor for decoupling", pinout: "Non-polarized - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// Capacitor Usage Notes
// 100nF capacitors are used for:
// - Decoupling (place near IC power pins)
// - Noise filtering
// - Debouncing circuits

// No direct Arduino code - hardware component
// Typical usage: Between VCC and GND near ICs` },
  { id: 15, name: "Capacitors 100uF", description: "100 microfarad electrolytic capacitor", pinout: "Polarized - Long leg/marked stripe side: Positive (+), Short leg: Negative (-)", category: "Electronic", quantity: 50, code_snippet: `// Electrolytic Capacitor Usage Notes
// 100uF capacitors are used for:
// - Power supply smoothing
// - Energy storage
// - Motor noise reduction

// No direct Arduino code - hardware component
// Connect: Positive to VCC, Negative to GND` },
  { id: 16, name: "Capacitors 100pF", description: "100 picofarad ceramic capacitor", pinout: "Non-polarized - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// Small Capacitor Usage Notes
// 100pF capacitors are used for:
// - High frequency filtering
// - RF applications
// - Crystal oscillator circuits

// No direct Arduino code - hardware component` },
  { id: 17, name: "Diodes IN4007", description: "1N4007 rectifier diode for protection", pinout: "Band/stripe side: Cathode (-), Other side: Anode (+)", category: "Electronic", quantity: 50, code_snippet: `// Diode Usage for Motor Protection
// Connect diode in reverse parallel with motor:
// - Cathode (stripe) to motor positive
// - Anode to motor negative
// This protects against back-EMF

// No direct Arduino code - hardware protection component` },
  { id: 18, name: "Resistors 220 ohm", description: "220 ohm resistor for LED current limiting", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// 220 ohm Resistor - LED Current Limiting
// For standard LEDs with 5V supply:
// I = (5V - 2V) / 220 ohm = 13.6mA (safe for LEDs)

// Connect in series with LED:
// Arduino Pin -> 220 ohm -> LED Anode -> LED Cathode -> GND` },
  { id: 19, name: "Resistors 560 ohm", description: "560 ohm resistor", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 115, code_snippet: `// 560 ohm Resistor Usage
// Typical uses:
// - LED current limiting (lower current than 220 ohm)
// - Voltage dividers
// - Signal conditioning` },
  { id: 20, name: "Resistors 1 kilohm", description: "1K ohm resistor", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// 1K ohm Resistor - Transistor Base Limiting
// For NPN transistor switching:
// Arduino Pin -> 1K ohm -> Transistor Base

// Also used for pull-down resistors and voltage dividers` },
  { id: 21, name: "Resistors 4.7 kilohm", description: "4.7K ohm resistor", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// 4.7K ohm Resistor Usage
// Common uses:
// - I2C pull-up resistors
// - Voltage dividers
// - Sensor interfaces` },
  { id: 22, name: "Resistors 10 kilohm", description: "10K ohm resistor", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// 10K ohm Resistor - LDR Voltage Divider
// Circuit: 5V -> LDR -> A0 -> 10K ohm -> GND
// This creates a voltage divider for light sensing

const int sensorPin = A0;
int lightLevel = analogRead(sensorPin);` },
  { id: 23, name: "Resistors 1 megohm", description: "1M ohm resistor", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// 1M ohm Resistor Usage
// High resistance applications:
// - Touch sensors
// - High impedance inputs
// - Timing circuits with capacitors` },
  { id: 24, name: "Resistors 10 megohm", description: "10M ohm resistor", pinout: "No polarity - can be connected either way", category: "Electronic", quantity: 50, code_snippet: `// 10M ohm Resistor Usage
// Very high resistance applications:
// - Electret microphone biasing
// - High impedance buffers
// - Capacitive touch sensing` },
  { id: 25, name: "Analog to Digital Converter (MCP3204)", description: "12-bit ADC with SPI interface", pinout: "VDD: 5V, VREF: Reference Voltage, AGND: Analog GND, DGND: Digital GND, CLK: SPI Clock, DOUT: Data Out, DIN: Data In, CS: Chip Select, CH0-CH3: Analog Inputs", category: "Interface", quantity: 20, code_snippet: `// MCP3204 12-bit ADC
#include <SPI.h>

const int csPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(csPin, OUTPUT);
  digitalWrite(csPin, HIGH);
  SPI.begin();
}

int readADC(int channel) {
  digitalWrite(csPin, LOW);
  byte command = 0b00000110 | ((channel & 0x04) >> 2);
  byte b1 = SPI.transfer(command);
  byte b2 = SPI.transfer((channel & 0x03) << 6);
  byte b3 = SPI.transfer(0x00);
  digitalWrite(csPin, HIGH);
  return ((b1 & 0x0F) << 8) | b2;
}

void loop() {
  int value = readADC(0);
  Serial.println(value);
  delay(100);
}` },
  { id: 26, name: "Ultrasonic Sensor", description: "HC-SR04 ultrasonic distance sensor", pinout: "VCC: 5V, Trig: Trigger Pin, Echo: Echo Pin, GND: Ground", category: "Sensor", quantity: 10, code_snippet: `// HC-SR04 Ultrasonic Distance Sensor
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // Send trigger pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  // Read echo
  long duration = pulseIn(echoPin, HIGH);
  float distance = duration * 0.034 / 2;
  
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
  delay(100);
}` },
  { id: 27, name: "PIR Motion Sensor", description: "Passive Infrared motion detector", pinout: "VCC: 5V, OUT: Digital Output, GND: Ground", category: "Sensor", quantity: 25, code_snippet: `// PIR Motion Sensor
const int pirPin = 2;
const int ledPin = 13;

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  delay(60000);  // Warm-up time (1 min)
}

void loop() {
  if (digitalRead(pirPin) == HIGH) {
    Serial.println("Motion detected!");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("No motion");
    digitalWrite(ledPin, LOW);
  }
  delay(500);
}` },
  { id: 28, name: "Temperature Sensor", description: "LM35 analog temperature sensor", pinout: "Left: VCC (5V), Middle: Output (A0), Right: GND", category: "Sensor", quantity: 35, code_snippet: `// LM35 Temperature Sensor
const int tempPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int reading = analogRead(tempPin);
  float voltage = reading * (5.0 / 1024.0);
  float temperature = voltage * 100;  // 10mV per degree
  
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  delay(1000);
}` },
  { id: 29, name: "DHT11", description: "Digital temperature and humidity sensor", pinout: "Pin 1: VCC (3.3-5V), Pin 2: Data, Pin 3: NC, Pin 4: GND. Use 10K pull-up on data pin.", category: "Sensor", quantity: 5, code_snippet: `// DHT11 Temperature & Humidity
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("% Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  delay(2000);
}` },
  { id: 30, name: "Relay Module", description: "5V relay module for switching high voltage/current loads", pinout: "VCC: 5V, GND: Ground, IN: Control Signal, COM: Common, NO: Normally Open, NC: Normally Closed", category: "Actuator", quantity: 10, code_snippet: `// Relay Module Control
const int relayPin = 7;

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);  // Relay OFF (active LOW)
}

void loop() {
  // Turn relay ON
  digitalWrite(relayPin, LOW);
  Serial.println("Relay ON");
  delay(3000);
  
  // Turn relay OFF
  digitalWrite(relayPin, HIGH);
  Serial.println("Relay OFF");
  delay(3000);
}` },
  { id: 31, name: "ESP01 WiFi Module (Node MCU)", description: "ESP8266 WiFi module for IoT connectivity", pinout: "VCC: 3.3V, GND: Ground, TX: Transmit, RX: Receive, CH_PD: Chip Enable, GPIO0, GPIO2, RST: Reset", category: "Communication", quantity: 13, code_snippet: `// ESP01 AT Commands via Software Serial
#include <SoftwareSerial.h>

SoftwareSerial esp(2, 3);  // RX, TX

void setup() {
  Serial.begin(9600);
  esp.begin(115200);
  
  esp.println("AT");
  delay(1000);
  while (esp.available()) {
    Serial.write(esp.read());
  }
}

void loop() {
  if (esp.available()) {
    Serial.write(esp.read());
  }
  if (Serial.available()) {
    esp.write(Serial.read());
  }
}` },
  { id: 32, name: "Soil Moisture Sensor", description: "Capacitive or resistive soil moisture sensor", pinout: "VCC: 3.3-5V, GND: Ground, AO: Analog Output, DO: Digital Output (threshold)", category: "Sensor", quantity: 5, code_snippet: `// Soil Moisture Sensor
const int moisturePin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int moisture = analogRead(moisturePin);
  int percentage = map(moisture, 1023, 0, 0, 100);
  
  Serial.print("Moisture: ");
  Serial.print(percentage);
  Serial.println("%");
  
  if (percentage < 30) {
    Serial.println("Soil is dry - needs water!");
  }
  delay(1000);
}` },
  { id: 33, name: "IR Sensor", description: "Infrared obstacle/proximity sensor", pinout: "VCC: 5V, GND: Ground, OUT: Digital Output", category: "Sensor", quantity: 15, code_snippet: `// IR Obstacle Sensor
const int irPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(irPin, INPUT);
}

void loop() {
  if (digitalRead(irPin) == LOW) {
    Serial.println("Obstacle detected!");
  } else {
    Serial.println("No obstacle");
  }
  delay(200);
}` },
  { id: 34, name: "Humidity Sensor", description: "Analog humidity sensor module", pinout: "VCC: 5V, GND: Ground, OUT: Analog Output", category: "Sensor", quantity: 5, code_snippet: `// Humidity Sensor (Analog)
const int humidityPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int rawValue = analogRead(humidityPin);
  float humidity = map(rawValue, 0, 1023, 0, 100);
  
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println("%");
  delay(1000);
}` },
  { id: 35, name: "PIC Microcontroller 16F877 IC", description: "PIC16F877A microcontroller IC", pinout: "40-pin DIP: MCLR, RA0-RA5, RE0-RE2, VDD, VSS, OSC1, OSC2, RC0-RC7, RD0-RD7, RB0-RB7", category: "Microcontroller", quantity: 10, code_snippet: `// PIC16F877A is programmed separately
// using MPLAB IDE and a PIC programmer

// Basic blink example (MPLAB C):
/*
#include <xc.h>
#define _XTAL_FREQ 20000000

void main() {
    TRISB = 0x00;
    while(1) {
        PORTB = 0xFF;
        __delay_ms(500);
        PORTB = 0x00;
        __delay_ms(500);
    }
}
*/` },
  { id: 36, name: "GPS NEO6M", description: "NEO-6M GPS module with antenna", pinout: "VCC: 3.3-5V, GND: Ground, TX: GPS Data Out, RX: GPS Data In", category: "Communication", quantity: 10, code_snippet: `// GPS NEO6M Module
#include <SoftwareSerial.h>

SoftwareSerial gps(4, 3);  // RX, TX

void setup() {
  Serial.begin(9600);
  gps.begin(9600);
}

void loop() {
  while (gps.available()) {
    char c = gps.read();
    Serial.write(c);
    // Parse NMEA sentences for lat/long
  }
}` },
  { id: 37, name: "GSM SIM900A", description: "GSM/GPRS module for cellular communication", pinout: "VCC: 4.2V (3.4-4.4V), GND: Ground, TXD: Transmit, RXD: Receive, RST: Reset", category: "Communication", quantity: 5, code_snippet: `// GSM SIM900A Module
#include <SoftwareSerial.h>

SoftwareSerial gsm(7, 8);  // RX, TX

void setup() {
  Serial.begin(9600);
  gsm.begin(9600);
  delay(1000);
  
  // Test AT command
  gsm.println("AT");
  delay(500);
}

void sendSMS(String number, String message) {
  gsm.println("AT+CMGF=1");  // Text mode
  delay(500);
  gsm.print("AT+CMGS=\"");
  gsm.print(number);
  gsm.println("\"");
  delay(500);
  gsm.print(message);
  gsm.write(26);  // Ctrl+Z to send
}

void loop() {
  if (gsm.available()) Serial.write(gsm.read());
  if (Serial.available()) gsm.write(Serial.read());
}` },
  { id: 38, name: "RFID Tag", description: "13.56MHz RFID tags/cards", pinout: "Passive tag - no connections needed", category: "Identification", quantity: 20, code_snippet: `// RFID Tags are passive
// They are read using an RFID reader (RC522)
// Each tag has a unique ID (UID)

// Tag UIDs are typically 4 or 7 bytes
// Example UID: 0x04 0xA3 0x2B 0x1C` },
  { id: 39, name: "RFID Reader", description: "RC522 RFID reader module", pinout: "SDA: SPI SS, SCK: SPI Clock, MOSI: SPI MOSI, MISO: SPI MISO, IRQ: Interrupt, GND: Ground, RST: Reset, 3.3V: Power", category: "Identification", quantity: 5, code_snippet: `// RFID RC522 Reader
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Scan RFID card...");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;
  
  Serial.print("UID: ");
  for (byte i = 0; i < rfid.uid.size; i++) {
    Serial.print(rfid.uid.uidByte[i], HEX);
    Serial.print(" ");
  }
  Serial.println();
  rfid.PICC_HaltA();
}` },
  { id: 40, name: "Light Sensor LDR", description: "Light Dependent Resistor module", pinout: "VCC: 5V, GND: Ground, AO: Analog Out, DO: Digital Out (threshold)", category: "Sensor", quantity: 10, code_snippet: `// LDR Light Sensor Module
const int analogPin = A0;
const int digitalPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(digitalPin, INPUT);
}

void loop() {
  int analogValue = analogRead(analogPin);
  int digitalValue = digitalRead(digitalPin);
  
  Serial.print("Analog: ");
  Serial.print(analogValue);
  Serial.print(" Digital: ");
  Serial.println(digitalValue);
  delay(500);
}` },
  { id: 41, name: "MPU-6050 Gyroscope", description: "6-axis accelerometer and gyroscope", pinout: "VCC: 3.3-5V, GND: Ground, SCL: I2C Clock, SDA: I2C Data, XDA: Aux I2C Data, XCL: Aux I2C Clock, AD0: Address Select, INT: Interrupt", category: "Sensor", quantity: 5, code_snippet: `// MPU-6050 Accelerometer/Gyroscope
#include <Wire.h>

const int MPU = 0x68;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
}

void loop() {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 14, true);
  
  int AcX = Wire.read() << 8 | Wire.read();
  int AcY = Wire.read() << 8 | Wire.read();
  int AcZ = Wire.read() << 8 | Wire.read();
  
  Serial.print("X: "); Serial.print(AcX);
  Serial.print(" Y: "); Serial.print(AcY);
  Serial.print(" Z: "); Serial.println(AcZ);
  delay(100);
}` },
  { id: 42, name: "TI Simplelink Sensor Tag Development Kit", description: "Texas Instruments CC2650 Sensor Tag", pinout: "Complete development kit with sensors", category: "Development Kit", quantity: 1, code_snippet: `// TI Simplelink Sensor Tag
// Programmed using Code Composer Studio
// Supports BLE communication

// Features: Temperature, Humidity, Pressure,
// Accelerometer, Gyroscope, Magnetometer, Light

// Use TI BLE Stack for programming` },
  { id: 43, name: "TI Simplelink Sensor DevPack", description: "Sensor expansion pack for TI Simplelink", pinout: "Connects to Simplelink boards via headers", category: "Development Kit", quantity: 1, code_snippet: `// TI Simplelink Sensor DevPack
// Extension for Simplelink boards
// Adds additional sensor capabilities

// Programmed via Code Composer Studio` },
  { id: 44, name: "Zigbee Wifi VXBB-02", description: "Zigbee WiFi bridge module", pinout: "VCC, GND, TX, RX, GPIO pins", category: "Communication", quantity: 1, code_snippet: `// Zigbee VXBB-02 Module
// Configured via AT commands
#include <SoftwareSerial.h>

SoftwareSerial zigbee(2, 3);

void setup() {
  Serial.begin(9600);
  zigbee.begin(9600);
}

void loop() {
  if (zigbee.available()) {
    Serial.write(zigbee.read());
  }
  if (Serial.available()) {
    zigbee.write(Serial.read());
  }
}` },
  { id: 45, name: "Zigbee VXBB-01", description: "Zigbee communication module", pinout: "VCC: 3.3V, GND: Ground, TX, RX, GPIO pins", category: "Communication", quantity: 2, code_snippet: `// Zigbee VXBB-01 Module
#include <SoftwareSerial.h>

SoftwareSerial zigbee(2, 3);

void setup() {
  Serial.begin(9600);
  zigbee.begin(9600);
}

void sendData(String data) {
  zigbee.println(data);
}

void loop() {
  if (zigbee.available()) {
    Serial.write(zigbee.read());
  }
}` },
  { id: 46, name: "Zigbee Bluetooth VBBB-01", description: "Zigbee Bluetooth combo module", pinout: "VCC: 3.3V, GND: Ground, TX, RX, BT pins", category: "Communication", quantity: 2, code_snippet: `// Zigbee Bluetooth VBBB-01
#include <SoftwareSerial.h>

SoftwareSerial module(2, 3);

void setup() {
  Serial.begin(9600);
  module.begin(9600);
  // Configure via AT commands
}

void loop() {
  if (module.available()) {
    Serial.write(module.read());
  }
  if (Serial.available()) {
    module.write(Serial.read());
  }
}` },
  { id: 47, name: "Dolphin Capacitive Proximity Switch", description: "Capacitive proximity sensor switch", pinout: "Brown: VCC (10-30V DC), Blue: GND, Black: Output (NPN)", category: "Sensor", quantity: 1, code_snippet: `// Capacitive Proximity Switch
const int sensorPin = 2;
const int ledPin = 13;

void setup() {
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(sensorPin) == HIGH) {
    Serial.println("Object detected!");
    digitalWrite(ledPin, HIGH);
  } else {
    Serial.println("No object");
    digitalWrite(ledPin, LOW);
  }
  delay(100);
}` },
  { id: 48, name: "Water Solenoid Valve G1/180", description: "Electric solenoid valve for water flow control", pinout: "Coil terminals (12V DC typical). Use relay module to control.", category: "Actuator", quantity: 1, code_snippet: `// Water Solenoid Valve Control
// Use relay module to switch valve

const int relayPin = 7;

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);  // Valve closed
}

void openValve() {
  digitalWrite(relayPin, LOW);
  Serial.println("Valve OPEN");
}

void closeValve() {
  digitalWrite(relayPin, HIGH);
  Serial.println("Valve CLOSED");
}

void loop() {
  openValve();
  delay(5000);
  closeValve();
  delay(5000);
}` },
  { id: 49, name: "Water Flow Sensor - YFS201", description: "Hall effect water flow sensor", pinout: "Red: VCC (5-24V), Black: GND, Yellow: Pulse Output", category: "Sensor", quantity: 1, code_snippet: `// YFS201 Water Flow Sensor
volatile int flowPulses = 0;
const int flowPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(flowPin, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(flowPin), countPulse, RISING);
}

void countPulse() {
  flowPulses++;
}

void loop() {
  int pulses = flowPulses;
  flowPulses = 0;
  
  // YFS201: 450 pulses per liter
  float liters = pulses / 450.0;
  float flowRate = liters * 60;  // L/min
  
  Serial.print("Flow: ");
  Serial.print(flowRate);
  Serial.println(" L/min");
  delay(1000);
}` }
];

export const scenarios = [
  {
    id: 1,
    title: "The Midnight Intruder Alarm",
    team_number: 1,
    situation: "The college lab is locked after 6 PM - but someone has been sneaking in undetected. The warden installs a lock, but it gets bypassed. CCTV is expensive. The warden reaches out to the IoT lab team and says: \"I need something that detects motion in the dark and raises an alarm - but lets me silence it quickly if it's just me checking in.\"",
    what_to_build: "1. Read LDR via analogRead to determine dark/light. When dark, monitor PIR for motion.\n2. Motion detected -> red LED flashes rapidly + piezo alarms.\n3. Pressing the pushbutton within 5 seconds silences the alarm.\n4. If button is NOT pressed within 5 s, alarm continues for a full 20 seconds.\n5. After alarm ends, system re-arms automatically. Use millis() - no delay().",
    components: ["Photo Resistor LDR", "PIR Motion Sensor", "LED (Red)", "Piezo Capsule", "Pushbuttons"]
  },
  {
    id: 2,
    title: "The Touchless Hospital Dustbin",
    team_number: 2,
    situation: "In the college medical room, bins are constantly being touched by multiple people - spreading germs during flu season. A nursing student raises a concern: \"We need bins that open themselves when you bring your hand close. No touch, no infection.\" The challenge is to make the lid movement smooth and controlled - not a sudden snap.",
    what_to_build: "1. Poll the HC-SR04 every 150 ms. When a hand is detected within 15 cm, smoothly sweep the servo from 0 degrees (closed) to 90 degrees (open) - one degree at a time, 8 ms between steps.\n2. Hold open for 4 seconds, then sweep back to 0 degrees at the same speed.\n3. Green LED stays on while lid is open.\n4. One short beep when opening, two short beeps when closing.\n5. Block re-trigger while lid is already moving or open.",
    components: ["Ultrasonic Sensor", "Small Servo Motor", "LED (Green)", "Piezo Capsule", "Resistors 220 ohm"]
  },
  {
    id: 3,
    title: "The Seminar Hall Occupancy Counter",
    team_number: 3,
    situation: "The college seminar hall seats 80 people but is never managed properly. Some events are dangerously overcrowded while others are half-empty. The Events Committee asks: \"Can we have a live headcount at the door - something that tells us exactly how many people are inside right now, without cameras or manual counting?\"",
    what_to_build: "1. Mount IR sensor A and B 5 cm apart at the door frame.\n2. Track which sensor triggers first: A then B = entry (count++), B then A = exit (count--).\n3. Allow a 300 ms window to detect the second sensor after the first fires.\n4. Display occupancy on 3 LEDs: green = low (0-3), yellow = medium (4-7), red = high (8+).\n5. A short beep on each valid entry or exit. Count must not go below 0.\n6. Log direction and count to Serial on every change.",
    components: ["IR Sensor", "IR Sensor", "LED (Green)", "LED (Yellow)", "LED (Red)"]
  },
  {
    id: 4,
    title: "The Smart Staircase Lighting",
    team_number: 4,
    situation: "The hostel staircase is completely dark after 10 PM. A student broke their wrist tripping in the dark last semester - the switch is at the wrong end and nobody bothers to flick it. The hostel warden wants lights that respond automatically, stay on long enough for safe passage, and need no switches at all.",
    what_to_build: "1. Two PIR sensors simulate top and bottom of a staircase.\n2. PIR-top triggers -> green LED on for 20 s; resets timer if motion is detected again within the window.\n3. PIR-bottom triggers -> red LED on for 20 s with the same re-trigger logic.\n4. Both LEDs can be on simultaneously - they operate fully independently.\n5. No blocking code - use millis() for both independent 20 s timers.\n6. Serial-print which PIR triggered and each LED's remaining time every 5 s.",
    components: ["PIR Motion Sensor", "PIR Motion Sensor", "LED (Green)", "LED (Red)", "Resistors 220 ohm"]
  },
  {
    id: 5,
    title: "The Smart Pedestrian Crossing",
    team_number: 5,
    situation: "A narrow lane through the college campus has become dangerous. Vehicles speed through while pedestrians step out from between parked cars. Two near-misses in the same month forced the administration to act. A proper traffic light system would take months of approval. You have a weekend and five components.",
    what_to_build: "1. Idle state: red LED on (stop), servo at 0 degrees (barrier down).\n2. Pedestrian presses button -> check HC-SR04 for vehicle (distance < 40 cm = vehicle present).\n3. Vehicle present -> red LED flashes fast, deny crossing, recheck every 500 ms for up to 10 s.\n4. No vehicle -> green LED on + servo sweeps to 90 degrees (barrier up). Hold crossing open for 7 s.\n5. Servo sweeps back to 0 degrees, green off, red on.\n6. Serial-log each button press, vehicle detection result, and crossing duration.",
    components: ["Pushbuttons", "Ultrasonic Sensor", "Small Servo Motor", "LED (Green)", "LED (Red)"]
  },
  {
    id: 6,
    title: "The Malfunctioning Traffic Signal",
    team_number: 6,
    situation: "The traffic signal at the college entrance has broken down. It's stuck on red and hasn't changed in two days. Vehicles are piling up and pedestrians are jaywalking dangerously. The college principal calls the IoT lab team: \"I need a temporary working traffic signal installed by tomorrow morning - one that runs automatically but lets a traffic officer override it manually with a button.\"",
    what_to_build: "1. Normal operation: cycle automatically - white LED on (go) for 8 s -> yellow LED blink 3 times (slow down) -> relay clicks off (stop/red, simulated) -> repeat.\n2. Piezo beeps once at every phase change so people nearby can hear the signal switch.\n3. Pushbutton = officer override: immediately jumps to stop phase (relay OFF, yellow LED off, white LED off) and holds for 15 s before resuming auto-cycle.\n4. During override: yellow LED flashes rapidly to indicate manual control is active.\n5. Use millis() for all phase timing - no delay(). Serial-print current phase and time remaining every second.",
    components: ["LED (Yellow)", "LED (Bright White)", "Pushbuttons", "Piezo Capsule", "Relay Module"]
  },
  {
    id: 7,
    title: "The Forgotten Classroom Lights",
    team_number: 7,
    situation: "Every evening the college classrooms are left with lights blazing - the last student out never bothers to switch them off. The electricity bill has doubled. The facilities manager is furious: \"I want the lights to turn off automatically when it gets dark outside and nobody is in the room - but I still want a manual override button for when someone genuinely needs to keep them on.\"",
    what_to_build: "1. Read LDR every 1 s using millis(). When ambient light drops below threshold (< 300 ADC) -> relay ON, simulating room lights turning off (or fan stopping).\n2. When light is above threshold (bright, daytime) -> relay stays OFF (lights not needed).\n3. White LED mirrors relay state - on when relay is on.\n4. Yellow LED = system status indicator, always on to show the controller is active.\n5. Pushbutton toggles a manual override flag: when override is ON, relay is forced OFF regardless of LDR (lights stay on). Press again to release override.\n6. Serial-print LDR value, relay state, and override flag every 2 s.",
    components: ["Photo Resistor LDR", "Relay Module", "LED (Yellow)", "LED (Bright White)", "Pushbuttons"]
  },
  {
    id: 8,
    title: "The Runaway Workshop Fan",
    team_number: 8,
    situation: "The college workshop bench fan has no speed limit. Students routinely crank it to maximum, and last semester the plastic blades cracked under stress, sending a fragment across the room. Nobody was hurt - barely. The HOD has mandated: the fan must not exceed a safe speed, and must slow itself down automatically if a student tries to go too fast.",
    what_to_build: "1. Read potentiometer every 200 ms. Map ADC (0-1023) to PWM (0-255) and drive DC motor via NPN transistor.\n2. Yellow LED = slow zone (PWM < 100). Both LEDs off = medium (100-200). Red LED = fast (> 200).\n3. When PWM > 220 (danger zone): automatically cap PWM at 180 - override the potentiometer input.\n4. Red LED rapid flash + piezo 3000 Hz warning beep every 2 s during override.\n5. When pot is dialled back below 200, restore normal pot control and clear override.\n6. Serial-log pot value, PWM applied, speed zone, and override flag every 500 ms.",
    components: ["Potentiometer 10 kilohm", "DC Motor 5V", "Transistor", "LED (Yellow)", "LED (Red)"]
  }
];

export function seedDatabase() {
  // Initialize the database
  initializeDatabase();

  // Always upsert canonical components and scenarios.
  // This keeps persistent stores recoverable if tests or manual edits polluted state.
  for (const component of components) {
    const docs = getComponentDocumentation(component.id) || {};
    addComponent({
      ...component,
      ...docs,
    });
  }

  for (const scenario of scenarios) {
    addScenario({
      id: scenario.id,
      title: scenario.title,
      situation: scenario.situation,
      what_to_build: scenario.what_to_build,
      team_number: scenario.team_number
    });
    
    // Find component IDs for this scenario
    const componentIds = scenario.components
      .map(name => components.find(c => c.name === name)?.id)
      .filter((id): id is number => id !== undefined);
    
    setScenarioComponents(scenario.id, componentIds);
  }

  const existingComponents = getAllComponents();
  console.log(`Database seeded successfully (${existingComponents.length} components, ${scenarios.length} canonical scenarios)`);
}
