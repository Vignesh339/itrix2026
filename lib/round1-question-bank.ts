import type { QuestionType, Round1Question } from '@/lib/db';

export type Round1BankDifficulty = 'Easy' | 'Hard';

export interface McqSeed {
  title: string;
  stem: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: Round1BankDifficulty;
}

export interface ScenarioSeed {
  id: string;
  title: string;
  prompt: string;
  questions: Array<{
    stem: string;
    options: [string, string, string, string];
    correctIndex: number;
  }>;
}

export interface ConnectionQuestionSeed {
  title: string;
  stem: string;
  codeSnippet: string;
  sourceNodes: string[];
  targetNodes: string[];
  expectedConnections: Array<{ from: string; to: string }>;
}

export interface SnippetCodingSeed {
  title: string;
  stem: string;
  referenceConnections: Array<{ from: string; to: string }>;
  requiredKeywords: string[];
}

export interface CircuitQuestionSeed {
  id: string;
  title: string;
  imageUrl: string;
  questions: Array<{
    stem: string;
    options: [string, string, string, string];
    correctIndex: number;
    difficulty: 'Easy' | 'Hard';
  }>;
}

interface BuiltQuestion {
  type: QuestionType;
  title: string;
  scenario: string;
  section: 'A' | 'B' | 'C' | 'D';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  timeLimit: number;
  options?: Array<{ id: string; text: string }>;
  matchingPairs?: Array<{ id: string; left: string; right: string }>;
  correctAnswer?: string | string[];
  scenario_group?: string;
  codeSnippet?: string;
  sourceNodes?: string[];
  targetNodes?: string[];
  expectedConnections?: Array<{ from: string; to: string }>;
  imageUrl?: string;
}

const OPTION_IDS = ['A', 'B', 'C', 'D'] as const;

const EASY_MCQ_SEEDS: McqSeed[] = [
  { title: 'GPIO Direction', stem: 'In Arduino, what does pinMode(pin, OUTPUT) do?', options: ['Sets the pin to read analog voltage', 'Sets the pin to produce a digital signal', 'Disables interrupts globally', 'Configures UART baud rate'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'ADC Width', stem: 'On Arduino Uno, analogRead() usually returns values in which range?', options: ['0 to 255', '0 to 1023', '0 to 2047', '0 to 4095'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'PWM Meaning', stem: 'PWM is mainly used in embedded systems to:', options: ['Encrypt serial traffic', 'Approximate analog output using duty cycle', 'Increase CPU clock speed', 'Store data in EEPROM'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Pull-up Resistor', stem: 'INPUT_PULLUP on Arduino is commonly used to:', options: ['Increase ADC precision', 'Keep a digital input from floating', 'Improve Wi-Fi range', 'Enable hardware PWM'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'I2C Wires', stem: 'The two primary I2C signal lines are:', options: ['TX and RX', 'MOSI and MISO', 'SDA and SCL', 'CS and CLK'], correctIndex: 2, difficulty: 'Easy' },
  { title: 'SPI Role', stem: 'In SPI communication, CS pin is used to:', options: ['Control ADC reference level', 'Select which slave device is active', 'Reset the microcontroller', 'Switch from 3.3V to 5V'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'UART Basics', stem: 'UART communication typically uses which pair?', options: ['SDA/SCL', 'TX/RX', 'MISO/MOSI', 'AIN+/AIN-'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'LDR Behavior', stem: 'For a typical LDR, resistance generally:', options: ['Increases when light increases', 'Decreases when light increases', 'Stays constant with light changes', 'Becomes negative in darkness'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'DHT Sensor', stem: 'DHT11/DHT22 sensors are used to measure:', options: ['Distance and velocity', 'Temperature and humidity', 'Voltage and current', 'Pressure and altitude only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Ultrasonic Timing', stem: 'HC-SR04 distance is computed from:', options: ['Current consumption of trigger pin', 'Echo pulse duration', 'Ambient light level', 'CPU clock cycles only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Servo Control', stem: 'Standard hobby servo position is commonly controlled using:', options: ['I2C packet count', 'PWM pulse width', 'ADC resolution bits', 'CAN arbitration ID'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Relay Purpose', stem: 'A relay module in IoT prototypes is mainly used to:', options: ['Amplify analog sensor voltage', 'Switch higher-voltage/current loads', 'Convert AC to DC automatically', 'Measure humidity'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Debounce', stem: 'Button debounce is required because mechanical switches:', options: ['Have floating-point rounding errors', 'Create rapid transient toggles when pressed', 'Need analog calibration daily', 'Lose EEPROM content'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Watchdog', stem: 'A watchdog timer helps by:', options: ['Generating PWM on extra channels', 'Resetting the MCU if firmware hangs', 'Increasing RAM size', 'Encrypting BLE packets'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Raspberry Pi Type', stem: 'Raspberry Pi is best described as a:', options: ['Bare-metal sensor only', 'Single board computer', 'Only a bootloader chip', 'Simple analog comparator'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'GPIO Voltage', stem: 'Most Raspberry Pi GPIO pins are logic-level:', options: ['1.8V', '3.3V', '5V tolerant always', '12V industrial'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'MQTT Pattern', stem: 'MQTT primarily follows which communication model?', options: ['Peer-to-peer block exchange', 'Publish/Subscribe through broker', 'Master-only serial polling', 'Token ring bus'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Topic in MQTT', stem: 'In MQTT, a topic is:', options: ['A battery chemistry type', 'A routing string for messages', 'A firmware checksum', 'An analog pin alias'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'QoS 0', stem: 'MQTT QoS 0 means:', options: ['Exactly once delivery', 'At least once delivery', 'Best effort delivery', 'Encrypted delivery'], correctIndex: 2, difficulty: 'Easy' },
  { title: 'Wi-Fi Module', stem: 'ESP32 is popular in IoT because it has built-in:', options: ['GPU tensor cores', 'Wi-Fi and Bluetooth', '48V PoE injector', 'Industrial PLC ladder runtime'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'HTTP Method', stem: 'To send sensor data to REST API, the common method is:', options: ['TRACE', 'POST', 'OPTIONS only', 'HEAD only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'JSON Role', stem: 'JSON in IoT cloud communication is typically used for:', options: ['Power conversion', 'Data serialization', 'Noise filtering', 'PWM generation'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Breadboard Rails', stem: 'On a standard breadboard, side rails are usually for:', options: ['Clock synthesis', 'Power distribution', 'SPI framing', 'EEPROM addressing'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Diode Protection', stem: 'A flyback diode is used with DC motors to:', options: ['Increase rotation speed', 'Suppress back EMF spikes', 'Reduce UART latency', 'Boost battery capacity'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Buzzer Use', stem: 'Piezo buzzer in embedded projects is generally an:', options: ['Input sensor', 'Audio output actuator', 'Protocol converter', 'Storage element'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Temperature Sensor', stem: 'LM35 output is generally proportional to:', options: ['Humidity', 'Temperature', 'Distance', 'Pressure'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Potentiometer', stem: 'A potentiometer used with analogRead acts as:', options: ['Current source', 'Variable voltage divider', 'Digital encoder', 'RF transmitter'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Serial Monitor', stem: 'Serial.begin(9600) sets:', options: ['ADC resolution', 'UART baud rate', 'I2C address', 'PWM duty cycle'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Raspberry Pi OS', stem: 'Raspberry Pi typically runs:', options: ['Bare C only', 'Linux-based OS', 'Only Arduino sketch format', 'No operating system support'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Node-RED', stem: 'Node-RED is commonly used to:', options: ['Solder PCB layers', 'Create visual IoT workflows', 'Fabricate sensors', 'Program FPGA bitstreams only'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'BLE Full Form', stem: 'BLE stands for:', options: ['Binary Logic Engine', 'Bluetooth Low Energy', 'Bus Line Encoder', 'Basic Link Ethernet'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Actuator Example', stem: 'Which is an actuator?', options: ['LDR', 'Ultrasonic sensor', 'Servo motor', 'Thermistor'], correctIndex: 2, difficulty: 'Easy' },
  { title: 'Sensor Example', stem: 'Which is a sensor?', options: ['Relay', 'DHT22', 'Buzzer', 'LED'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Digital Read Values', stem: 'digitalRead() returns:', options: ['Only floating values', 'HIGH or LOW', '0 to 1023', 'Signed 16-bit value always'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Loop Function', stem: 'In Arduino, loop() function:', options: ['Runs once after reset', 'Runs repeatedly after setup()', 'Only runs on interrupt', 'Runs only in debug mode'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Setup Function', stem: 'In Arduino, setup() is mainly for:', options: ['Repeated sensing forever', 'One-time initialization', 'Automatic cloud upload', 'Compiling sketches at runtime'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'I2C Pullups', stem: 'I2C lines usually require:', options: ['Series capacitors only', 'Pull-up resistors', 'H-bridge drivers', 'Optocouplers always'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'GPIO Expander', stem: 'GPIO expander is used when:', options: ['Need more digital pins than MCU has', 'Need faster ADC conversion', 'Need camera ISP', 'Need LTE modem'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'Cloud Dashboard', stem: 'IoT dashboard mainly helps to:', options: ['Manufacture PCBs', 'Visualize and monitor telemetry', 'Increase battery voltage', 'Generate C compiler binaries'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'OTA Meaning', stem: 'OTA firmware update means:', options: ['Over-the-air update', 'Only terminal access', 'Offline timing adjustment', 'Output threshold averaging'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'Ground Reference', stem: 'In mixed modules, common GND is required to:', options: ['Increase Wi-Fi range', 'Share voltage reference between modules', 'Reduce flash memory use', 'Enable PWM on all pins'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'NVIDIA SBC Example', stem: 'Which board is a GPU-capable SBC often used for edge AI?', options: ['Arduino Nano', 'Jetson Nano', 'ATmega328P DIP chip', 'L293D motor driver'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Edge AI', stem: 'Edge AI means running inference:', options: ['Only in remote cloud', 'On or near the device', 'Inside battery charger', 'Inside USB cable'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'I2C Address', stem: 'If two I2C devices have same fixed address, common workaround is:', options: ['Increase baud rate', 'Use I2C multiplexer', 'Switch to pull-down resistors', 'Disable ACK'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Sampling Rate', stem: 'Sampling rate of a sensor defines:', options: ['Power supply polarity', 'How often data is measured', 'Pin mode direction', 'Packet encryption key size'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Latency', stem: 'In IoT systems, latency refers to:', options: ['Battery weight', 'Delay between event and response', 'ADC pin count', 'Wire gauge thickness'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Threshold Alert', stem: 'A threshold-based alert triggers when:', options: ['Data equals zero always', 'Measurement crosses configured limit', 'MCU enters sleep mode', 'UART parity is odd'], correctIndex: 1, difficulty: 'Easy' },
  { title: 'Raspberry Pi Camera', stem: 'Raspberry Pi camera module is typically connected through:', options: ['CSI interface', 'PWM pin', 'I2C only', 'CAN bus only'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'Basic RTOS Use', stem: 'A small RTOS helps embedded apps by:', options: ['Adding deterministic task scheduling', 'Increasing analog voltage', 'Replacing sensors', 'Disabling interrupts permanently'], correctIndex: 0, difficulty: 'Easy' },
  { title: 'EEPROM Usage', stem: 'EEPROM is commonly used to store:', options: ['Temporary RAM stack', 'Persistent configuration values', 'Live camera frames', 'Analog waveform output'], correctIndex: 1, difficulty: 'Easy' },
];

const HARD_MCQ_SEEDS: McqSeed[] = [
  { title: 'Nyquist Criterion', stem: 'To avoid aliasing, minimum sample rate should be:', options: ['Equal to highest signal frequency', 'At least twice the highest signal frequency', 'Half the highest signal frequency', 'Unrelated to input frequency'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Interrupt Jitter', stem: 'High interrupt jitter most directly affects:', options: ['Deterministic control loop timing', 'EEPROM capacity', 'I2C addressing', 'GPIO voltage level'], correctIndex: 0, difficulty: 'Hard' },
  { title: 'I2C Clock Stretching', stem: 'Clock stretching in I2C allows a slave to:', options: ['Boost bus voltage', 'Hold SCL low to delay master', 'Change its own address dynamically', 'Bypass ACK/NACK'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'CAN Arbitration', stem: 'CAN bus arbitration is based on:', options: ['Random backoff', 'Priority by identifier bits', 'Master token polling', 'Physical port number'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Debounce Strategy', stem: 'For robust debounce in noisy systems, best approach is:', options: ['Single immediate read only', 'State machine with time threshold', 'Increase supply voltage', 'Disable pull-ups'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'EMI Mitigation', stem: 'For long sensor wires in industrial environment, preferred approach is:', options: ['Use only higher ADC reference', 'Use differential signaling and shielding', 'Increase PWM frequency blindly', 'Disable grounding'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Kalman Use', stem: 'Kalman filtering in embedded sensing is primarily for:', options: ['Bootloader encryption', 'State estimation under noisy measurements', 'I2C arbitration', 'GPIO remapping'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge Inference Budget', stem: 'On GPU SBC deployment, first sizing constraint is often:', options: ['LED brightness', 'Memory and thermal envelope', 'I2C pull-up value', 'Buzzer volume'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Duty-Cycle Compliance', stem: 'In LPWAN planning, duty-cycle restrictions mainly limit:', options: ['Sensor resolution bits', 'Allowed airtime per period', 'Flash wear cycles', 'ADC offset'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'MQTT Retained Message', stem: 'Retained MQTT message is best described as:', options: ['A packet with CRC failure', 'Last known value stored by broker for topic', 'A duplicated QoS2 frame', 'A TLS handshake artifact'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Idempotent Command', stem: 'Idempotent device command means:', options: ['Command cannot fail', 'Repeated execution leaves same final state', 'Command uses UDP', 'Command uses binary payload'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Backpressure', stem: 'Backpressure in telemetry pipelines prevents:', options: ['ADC conversion', 'Unbounded queue growth during bursts', 'Clock synchronization', 'Sensor calibration'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Secure Boot Chain', stem: 'Secure boot primarily validates:', options: ['Sensor cable length', 'Firmware authenticity before execution', 'UART packet length', 'Cloud dashboard latency'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'OTA Rollback Trigger', stem: 'A robust OTA rollback policy should be based on:', options: ['Color of status LED', 'Health metrics and boot success criteria', 'Battery label', 'Clock source only'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Time Sync Drift', stem: 'In distributed IoT logs, unsynchronized clocks primarily break:', options: ['GPIO pull-ups', 'Event ordering and correlation', 'PWM output', 'I2C voltage'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Sensor Fusion', stem: 'Combining IMU and GPS with complementary strengths is called:', options: ['Link aggregation', 'Sensor fusion', 'Thread starvation', 'Heap compaction'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'ADC Input Impedance', stem: 'If ADC source impedance is too high, a common issue is:', options: ['Better linearity automatically', 'Sampling capacitor not settling properly', 'Infinite resolution', 'No need for anti-alias filter'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'RTOS Priority Inversion', stem: 'Priority inversion can be mitigated with:', options: ['Bigger LEDs', 'Priority inheritance mutex', 'Lower UART baud', 'Disabling interrupts always'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge Model Quantization', stem: 'INT8 quantization usually targets:', options: ['Larger model size', 'Lower memory/latency tradeoff', 'Higher supply voltage', 'More GPIO pins'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'SBC Thermal Throttling', stem: 'When Jetson inference FPS drops after few minutes, likely cause is:', options: ['EEPROM corruption', 'Thermal throttling', 'I2C clock stretching', 'Pin mislabeling'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'TLS Mutual Auth', stem: 'Mutual TLS in IoT ensures:', options: ['Only server authenticates client', 'Both client and server authenticate each other', 'No certificate management needed', 'Only symmetric keys allowed'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Replay Protection', stem: 'Nonce/timestamp in command channel is used to prevent:', options: ['Packet compression', 'Replay attacks', 'UART framing error', 'Sensor drift'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Battery SOC Estimation', stem: 'Coulomb counting alone can drift due to:', options: ['Perfect integration always', 'Current sensor offset accumulation', 'More PWM channels', 'Lower voltage ripple'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Ground Loop', stem: 'A ground loop problem often manifests as:', options: ['Stable zero-noise ADC', 'Measurement noise/hum and offset issues', 'Faster Wi-Fi throughput', 'Lower flash wear'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Hysteresis Threshold', stem: 'Hysteresis in control logic mainly reduces:', options: ['EEPROM writes', 'Rapid toggling near threshold', 'I2C address conflicts', 'Kernel panics'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'LoRa Spreading Factor', stem: 'Higher LoRa spreading factor generally gives:', options: ['Higher throughput and lower range', 'Lower throughput and higher range sensitivity', 'No effect on airtime', 'Always lower power consumption'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Message Ordering', stem: 'To maintain order in distributed ingestion, common approach is:', options: ['Ignore timestamps', 'Partition keys and sequence numbers', 'Use random topic names', 'Disable retries'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Fail-safe Design', stem: 'In safety-critical actuator control, fail-safe default should be:', options: ['Maximum power output', 'Known safe state on fault', 'Undefined output', 'Last random output'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Brownout Detection', stem: 'Brownout reset circuitry protects MCU from:', options: ['Excessive Wi-Fi packets', 'Operating at unsafe low voltage', 'Overclocking by compiler', 'I2C NACK'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Watchdog Window', stem: 'Windowed watchdog catches both:', options: ['Only late refresh', 'Too-early and too-late refreshes', 'ADC overflow', 'SPI bus conflicts only'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'DMA Benefit', stem: 'DMA is useful in embedded streaming because it:', options: ['Increases GPIO count', 'Moves data without heavy CPU intervention', 'Encrypts sensor values', 'Raises supply voltage'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Heap Fragmentation', stem: 'Long-running IoT firmware often avoids dynamic allocation because of:', options: ['Mandatory CAN rule', 'Heap fragmentation risk', 'Lack of interrupts', 'ADC mismatch'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'CAN Termination', stem: 'Typical CAN bus requires 120 ohm termination at:', options: ['Every node', 'Both ends of the bus', 'Only master node', 'Only sensor node'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'OTA Delta Update', stem: 'Delta OTA update mainly reduces:', options: ['CPU instruction set', 'Data transfer size', 'I2C clock speed', 'GPIO voltage'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge/Cloud Split', stem: 'A good edge-cloud partition keeps on edge:', options: ['Only dashboard rendering', 'Low-latency filtering and local actuation logic', 'Long-term archival only', 'Certificate authority only'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Digital Twin Sync', stem: 'Digital twin value depends on:', options: ['Manual once-a-day update', 'Reliable state synchronization with physical asset', 'High LED brightness', 'Disabling telemetry retries'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Sensor Calibration Drift', stem: 'Drift compensation generally needs:', options: ['No reference ever', 'Periodic reference checks and recalibration model', 'Higher UART baud only', 'Extra pull-up resistors'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Outlier Rejection', stem: 'Median filter is strong against:', options: ['Constant bias only', 'Impulse outliers', 'Clock skew', 'PWM dead time'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'State Machine Design', stem: 'Explicit finite state machines are preferred in firmware because they:', options: ['Reduce readability', 'Make transitions deterministic and testable', 'Require internet access', 'Disable interrupts'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Raspberry Pi Real-time', stem: 'When strict deterministic timing is needed, common strategy is:', options: ['Only user-space Python loops', 'Offload hard real-time tasks to MCU', 'Increase HDMI resolution', 'Disable all interrupts'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'GPU SBC Pipeline', stem: 'For camera AI on GPU SBC, preprocessing bottleneck often occurs at:', options: ['GPIO initialization', 'Frame decode/resize pipeline', 'I2C addressing', 'EEPROM reads'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Telemetry Compression', stem: 'When compressing telemetry, best candidate is:', options: ['Short random strings', 'Structured repetitive payload batches', 'Single-bit GPIO values only', 'TLS handshake packets'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Data Integrity', stem: 'CRC in embedded links is used for:', options: ['Confidentiality', 'Error detection', 'Authentication only', 'Power management'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Clock Domain Crossing', stem: 'Unsafe clock-domain crossing can cause:', options: ['Guaranteed deterministic behavior', 'Metastability issues', 'Higher battery life', 'Lower thermal output'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Slew Rate', stem: 'High dV/dt switching near analog front-end can:', options: ['Reduce noise automatically', 'Inject EMI/noise into measurements', 'Increase ADC bits', 'Improve calibration'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Power Budget', stem: 'In battery IoT design, average current should be estimated using:', options: ['Only active mode current', 'Duty-cycle weighted current profile', 'Only sleep current', 'Only peak current'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Firmware Logging', stem: 'On constrained devices, robust logging strategy is to:', options: ['Print every loop forever', 'Use leveled ring-buffered logs', 'Store stack dumps in RAM only', 'Disable all error logs'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Provisioning Security', stem: 'Factory provisioning should avoid:', options: ['Per-device keys', 'Shared default credentials across fleet', 'Hardware root of trust', 'Certificate rotation plans'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Anomaly Baseline', stem: 'IoT anomaly detection quality improves with:', options: ['No baseline data', 'Representative baseline and seasonal context', 'Only one threshold forever', 'Ignoring sensor metadata'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Regression Containment', stem: 'Best OTA regression containment is:', options: ['Global rollout first', 'Canary stages with automatic rollback', 'Manual reboot only', 'Skip health checks'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Edge Cache Strategy', stem: 'Intermittent connectivity is best handled with:', options: ['Discard data while offline', 'Store-and-forward local buffering', 'Disable timestamps', 'Reduce sampling to zero'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Safety Interlock', stem: 'Actuator safety interlock should be implemented as:', options: ['UI-only warning popup', 'Hardware/software enforced guard condition', 'Occasional manual reminder', 'Cloud-only check after actuation'], correctIndex: 1, difficulty: 'Hard' },
  { title: 'Formal Verification Fit', stem: 'Which component most benefits from formal checks in embedded systems?', options: ['Color theme CSS', 'State transition and safety logic', 'Board silkscreen text', 'USB cable brand'], correctIndex: 1, difficulty: 'Hard' },
];

const SCENARIO_SEEDS: ScenarioSeed[] = [
  {
    id: 'smart_agriculture',
    title: 'Smart Agriculture IoT',
    prompt: 'A smart agriculture system is deployed across a large farm to automate irrigation. Each IoT node has a soil moisture sensor, a temperature sensor, and a water flow sensor connected to a microcontroller (Arduino/ESP32). The microcontroller runs firmware that reads sensor data, applies threshold logic, and communicates with a cloud platform using the MQTT protocol over a LoRaWAN gateway. Soil moisture sensors produce analog voltage signals. The system uses duty-cycled sleep modes to extend battery life. Sensor data is published to specific MQTT topics, and the cloud broker triggers actuators (water pumps) based on subscriptions. Engineers observe that readings fluctuate even in stable conditions. The LoRa signal weakens at the far end of the farm. Some nodes lose connectivity intermittently, and over-the-air (OTA) firmware updates are planned for all deployed nodes.',
    questions: [
      { stem: 'Which protocol does this system use to send sensor data to the cloud?', options: ['MQTT', 'HTTP REST', 'FTP', 'SMTP'], correctIndex: 0 },
      { stem: 'What is the purpose of duty-cycled sleep mode in IoT sensor nodes?', options: ['Improve data accuracy', 'Extend battery life by reducing active time', 'Increase transmission range', 'Speed up ADC conversion'], correctIndex: 1 },
      { stem: 'In MQTT, a device that receives messages based on a topic is called a:', options: ['Publisher', 'Broker', 'Subscriber', 'Gateway'], correctIndex: 2 },
      { stem: 'Why does the soil moisture sensor output need ADC processing?', options: ['To encrypt the signal', 'To increase signal frequency', 'To reduce power draw', 'To convert analog voltage to a digital value the MCU can process'], correctIndex: 3 },
      { stem: 'What is the role of the LoRaWAN gateway in this system?', options: ['It bridges LoRa radio packets to an IP network', 'It stores sensor data locally', 'It powers the sensor nodes', 'It runs the MQTT broker'], correctIndex: 0 },
      { stem: 'What causes sensor readings to fluctuate even under stable physical conditions?', options: ['MQTT broker overload', 'ADC quantization noise and sensor-inherent noise', 'LoRa channel switching', 'OTA update interference'], correctIndex: 1 },
      { stem: 'Which spreading factor in LoRa increases range but reduces data rate?', options: ['SF7', 'SF1', 'SF12', 'SF0'], correctIndex: 2 },
      { stem: 'OTA (Over-the-Air) updates in IoT primarily serve to:', options: ['Physically replace hardware components', 'Increase sensor sampling rate', 'Reconfigure the MQTT broker', 'Remotely update device firmware without manual access'], correctIndex: 3 },
      { stem: 'Which IoT architecture layer is responsible for data collection via sensors?', options: ['Perception layer', 'Application layer', 'Network layer', 'Business layer'], correctIndex: 0 },
      { stem: 'What happens when an MQTT message is published with QoS level 2?', options: ['Message may be lost', 'Message is delivered exactly once with a 4-step handshake', 'Message is delivered at most once', 'Message is broadcast to all brokers'], correctIndex: 1 },
    ],
  },
  {
    id: 'smart_home',
    title: 'Smart Home IoT',
    prompt: 'A smart home system integrates motion sensors, smart bulbs, a thermostat, a doorbell camera, and a voice assistant hub. Devices communicate over Zigbee for short-range low-power links and Wi-Fi for high-bandwidth devices like cameras. A local home hub (e.g., Home Assistant) manages automation rules and connects to the cloud. The thermostat uses a PID control algorithm to maintain target temperatures. The doorbell camera streams H.264 compressed video to cloud storage. All inter-device communication is secured using TLS 1.3. Users access the system remotely via OAuth 2.0 authenticated mobile apps. The homeowner reports that Zigbee devices near the microwave experience interference. The camera occasionally drops frames, and the hub\'s local processing struggles when multiple automations trigger simultaneously.',
    questions: [
      { stem: 'Why is Zigbee preferred over Wi-Fi for smart bulbs and sensors in this system?', options: ['Zigbee operates on lower power and supports mesh networking', 'Zigbee has higher bandwidth', 'Zigbee works only with Apple devices', 'Zigbee eliminates the need for a hub'], correctIndex: 0 },
      { stem: 'What causes Zigbee interference near a microwave oven?', options: ['Magnetic fields from the microwave motor', 'Both Zigbee (2.4 GHz) and microwaves operate in overlapping frequency bands', 'Microwave draws too much current', 'The hub overheats near the microwave'], correctIndex: 1 },
      { stem: 'What does TLS 1.3 provide in this smart home system?', options: ['Device firmware compression', 'Video stream buffering', 'Encrypted and authenticated communication between devices and cloud', 'Zigbee channel selection'], correctIndex: 2 },
      { stem: 'OAuth 2.0 in the mobile app is used for:', options: ['Video compression', 'Sensor calibration', 'Zigbee pairing', 'Secure delegated access without sharing user credentials'], correctIndex: 3 },
      { stem: 'The thermostat uses a PID algorithm. What does PID stand for?', options: ['Proportional-Integral-Derivative', 'Packet Inspection Device', 'Protocol Interface Driver', 'Power Isolation Device'], correctIndex: 0 },
      { stem: 'Why does the camera use H.264 compression for video streaming?', options: ['H.264 increases video resolution', 'H.264 reduces bandwidth and storage requirements while maintaining quality', 'H.264 is required by Zigbee protocol', 'H.264 encrypts video automatically'], correctIndex: 1 },
      { stem: 'What is the primary advantage of local processing on a home hub vs. cloud-only processing?', options: ['Higher storage capacity', 'Better video quality', 'Faster response and functionality even without internet', 'Automatic firmware updates'], correctIndex: 2 },
      { stem: 'In a Zigbee mesh network, devices that relay messages for others are called:', options: ['End devices', 'Coordinators', 'Gateways', 'Routers'], correctIndex: 3 },
      { stem: 'Which layer of the IoT stack handles user-facing applications and dashboards?', options: ['Application layer', 'Perception layer', 'Network layer', 'Transport layer'], correctIndex: 0 },
      { stem: 'What is \'edge computing\' in the context of this smart home?', options: ['Running apps on the cloud only', 'Processing data locally on the hub rather than sending everything to the cloud', 'Using Zigbee instead of Wi-Fi', 'Compressing video before storage'], correctIndex: 1 },
    ],
  },
  {
    id: 'smart_traffic',
    title: 'Smart Traffic IoT',
    prompt: 'A smart traffic management system is deployed at urban intersections across a city. Inductive loop sensors and LiDAR units detect vehicle presence and speed. Overhead edge computing nodes (NVIDIA Jetson-based) run real-time computer vision models to count vehicles and detect accidents, reducing latency compared to cloud-only processing. Traffic controllers communicate using the NTCIP (National Transportation Communications for ITS Protocol) standard over a fibre backhaul. Emergency vehicles carry V2I (Vehicle-to-Infrastructure) transponders operating on DSRC (5.9 GHz) to pre-empt signal phases. The system publishes real-time congestion data via REST APIs consumed by navigation apps. Security engineers are concerned about spoofing attacks on V2I communication. Data retention policies require all incident footage to be stored encrypted for 30 days.',
    questions: [
      { stem: 'Why are edge computing nodes used at intersections instead of sending all data to the cloud?', options: ['Edge processing reduces latency for real-time decisions', 'Cloud storage is too expensive', 'Cloud cannot process video data', 'Edge nodes replace inductive loop sensors'], correctIndex: 0 },
      { stem: 'What technology do emergency vehicles use to communicate with traffic signals in this system?', options: ['Bluetooth 5.0', 'DSRC (Dedicated Short-Range Communication) at 5.9 GHz', 'Zigbee mesh', 'LoRaWAN'], correctIndex: 1 },
      { stem: 'What is a spoofing attack in the context of V2I communication?', options: ['Overloading the traffic controller with requests', 'Intercepting and reading V2I packets', 'A fake vehicle/device transmitting false identity or data to infrastructure', 'Jamming the DSRC frequency band'], correctIndex: 2 },
      { stem: 'Why is LiDAR used alongside inductive loop sensors in this system?', options: ['LiDAR is cheaper than loops', 'LiDAR works only at night', 'LiDAR replaces fibre backhaul', 'LiDAR provides 3D spatial data including speed and object classification'], correctIndex: 3 },
      { stem: 'What is the purpose of a REST API in this traffic system?', options: ['To expose real-time traffic data to external apps over HTTP', 'To configure traffic light hardware directly', 'To encrypt stored footage', 'To manage V2I transponder pairing'], correctIndex: 0 },
      { stem: 'Encrypting stored incident footage primarily protects against:', options: ['Video quality degradation', 'Unauthorised access to sensitive surveillance data', 'Network congestion', 'Edge node overheating'], correctIndex: 1 },
      { stem: 'Which of the following best describes V2I communication?', options: ['Vehicle to vehicle data exchange', 'Video streaming from camera to cloud', 'Data exchange between a vehicle and roadside infrastructure', 'Communication between two traffic controllers'], correctIndex: 2 },
      { stem: 'In IoT systems, what does \'latency\' refer to?', options: ['The amount of data stored per second', 'The number of devices connected to a network', 'The encryption strength of a protocol', 'The delay between data generation and its processing/response'], correctIndex: 3 },
      { stem: 'What is the main advantage of fibre backhaul over cellular for traffic infrastructure?', options: ['Fibre provides higher bandwidth and more reliable low-latency connectivity', 'Fibre is wireless', 'Fibre is cheaper to install', 'Fibre supports V2I natively'], correctIndex: 0 },
      { stem: 'Real-time computer vision at the edge node is used to:', options: ['Store video permanently', 'Detect vehicles, count traffic, and identify incidents without cloud round-trips', 'Manage NTCIP protocol packets', 'Pair emergency transponders'], correctIndex: 1 },
    ],
  },
  {
    id: 'smart_healthcare',
    title: 'Smart Healthcare IoT',
    prompt: 'A hospital ICU deploys an IoT patient monitoring platform. Wearable patches measure ECG, SpO2, respiratory rate, and skin temperature. These patches use Bluetooth Low Energy (BLE) to stream data to bedside hubs, which aggregate readings and forward them over hospital Wi-Fi to an on-premise edge server. The edge server runs anomaly detection algorithms and triggers alerts on nurses\' tablets via push notifications when parameters exceed clinical thresholds. All data is HL7 FHIR-compliant and integrated with the hospital\'s Electronic Health Record (EHR) system. Data is encrypted end-to-end using AES-256. The system must comply with HIPAA regulations. Engineers face challenges with BLE interference in the RF-dense ICU, false-positive alerts from motion artefacts during patient movement, and secure remote access for physicians reviewing data off-site.',
    questions: [
      { stem: 'Why is Bluetooth Low Energy (BLE) used instead of Wi-Fi for wearable patches?', options: ['BLE consumes significantly less power, extending wearable battery life', 'BLE has higher data rate than Wi-Fi', 'BLE has longer range than Wi-Fi', 'BLE is required by HIPAA regulations'], correctIndex: 0 },
      { stem: 'What does HL7 FHIR define in the context of this system?', options: ['Encryption algorithm for patient data', 'A standard format for exchanging electronic health information', 'Wireless protocol for BLE devices', 'Alert threshold values for ICU monitors'], correctIndex: 1 },
      { stem: 'What regulation primarily governs patient data privacy in this US hospital system?', options: ['GDPR', 'ISO 27001', 'HIPAA', 'PCI-DSS'], correctIndex: 2 },
      { stem: 'Motion artefacts in wearable ECG sensors cause false alerts because:', options: ['BLE signal is disrupted by movement', 'The EHR system cannot process movement data', 'AES-256 encryption adds processing delay', 'Patient movement introduces noise that mimics abnormal waveforms'], correctIndex: 3 },
      { stem: 'What is the primary purpose of AES-256 encryption in this system?', options: ['To ensure patient data is unreadable if intercepted or breached', 'To compress patient data for faster transmission', 'To authenticate nurses\' tablets', 'To comply with HL7 FHIR standards'], correctIndex: 0 },
      { stem: 'Why is an on-premise edge server used instead of processing all data in the public cloud?', options: ['Cloud platforms cannot handle BLE data', 'Edge processing reduces latency for critical alerts and keeps sensitive data within the hospital', 'On-premise servers are cheaper than cloud', 'Public cloud does not support HL7 FHIR'], correctIndex: 1 },
      { stem: 'SpO2 sensors measure blood oxygen levels using which principle?', options: ['Electrical impedance of blood', 'Ultrasonic pulse reflection', 'Differential light absorption of oxygenated and deoxygenated haemoglobin', 'Skin temperature differential'], correctIndex: 2 },
      { stem: 'What causes BLE interference in the ICU environment?', options: ['AES-256 encryption overhead', 'HL7 FHIR data parsing delays', 'EHR system network traffic', 'Many BLE devices and other 2.4 GHz equipment operating in a dense RF environment'], correctIndex: 3 },
      { stem: 'Secure remote access for off-site physicians should implement which security measure?', options: ['Multi-factor authentication (MFA) and encrypted VPN or zero-trust access', 'Unencrypted VPN for speed', 'Shared password across all physicians', 'Direct BLE connection from home'], correctIndex: 0 },
      { stem: 'In IoT healthcare, what is \'data interoperability\'?', options: ['Encrypting data before storage', 'The ability of different systems and devices to exchange and use health data seamlessly', 'Streaming ECG in real time', 'Backing up data to multiple servers'], correctIndex: 1 },
    ],
  },
  {
    id: 'smart_city',
    title: 'Smart City IoT',
    prompt: 'A metropolitan smart city platform integrates thousands of IoT devices: adaptive LED streetlights with ambient and motion sensors, ultrasonic fill-level sensors in waste bins, distributed air quality monitors measuring CO2, NO2, and PM2.5, and smart parking sensors using magnetometers. All sensor nodes use NB-IoT (Narrowband IoT) as the communication protocol, chosen for deep indoor/urban penetration and low power consumption. Data flows to a centralised City Operating Centre (COC) via a multi-tier IoT platform (device → gateway → message broker → analytics engine → dashboard). The city\'s cybersecurity team recently identified that several sensor nodes are running outdated firmware with known CVEs. The analytics platform uses time-series databases and ML models to predict waste bin fill levels and optimise collection routes. Citizens can access real-time parking availability via a public API.',
    questions: [
      { stem: 'Why is NB-IoT chosen over LoRaWAN for this dense urban smart city deployment?', options: ['NB-IoT uses licensed cellular spectrum providing better urban penetration and QoS guarantees', 'NB-IoT is license-free', 'NB-IoT has higher data rates than LoRaWAN', 'NB-IoT does not require a SIM card'], correctIndex: 0 },
      { stem: 'What is a CVE in the context of IoT cybersecurity?', options: ['A communication protocol for smart sensors', 'A publicly disclosed vulnerability in software or firmware', 'A type of encryption standard', 'A certificate for device authentication'], correctIndex: 1 },
      { stem: 'What type of sensor is used in smart parking to detect vehicle presence?', options: ['Ultrasonic fill-level sensor', 'LiDAR scanner', 'Magnetometer detecting changes in Earth\'s magnetic field caused by vehicles', 'Infrared temperature sensor'], correctIndex: 2 },
      { stem: 'Why does the analytics platform use a time-series database for sensor data?', options: ['Time-series databases support 3D spatial queries', 'Time-series databases encrypt data automatically', 'Time-series databases replace the message broker', 'Sensor data is inherently timestamped and time-series DBs are optimised for sequential time-indexed data'], correctIndex: 3 },
      { stem: 'What is the role of the message broker in the IoT platform architecture?', options: ['To decouple producers and consumers of data, routing messages between devices and applications', 'To store time-series data permanently', 'To run ML prediction models', 'To manage NB-IoT SIM cards'], correctIndex: 0 },
      { stem: 'PM2.5 in air quality monitoring refers to:', options: ['A type of CO2 measurement protocol', 'Particulate matter with diameter ≤ 2.5 micrometres, posing respiratory health risks', 'A smart city communication standard', 'Power management version 2.5 for IoT nodes'], correctIndex: 1 },
      { stem: 'How do ML models improve waste collection in this smart city?', options: ['By replacing fill-level sensors with cameras', 'By encrypting collection schedules', 'By predicting when bins will be full to enable proactive, route-optimised collection', 'By reducing the number of bins needed'], correctIndex: 2 },
      { stem: 'What is the main security risk of running outdated firmware on deployed IoT nodes?', options: ['Outdated firmware increases power consumption', 'Outdated firmware reduces sensor accuracy', 'Outdated firmware causes NB-IoT deregistration', 'Known vulnerabilities (CVEs) can be exploited by attackers to compromise city infrastructure'], correctIndex: 3 },
      { stem: 'Which of the following best describes a multi-tier IoT architecture?', options: ['Layered components (devices, gateways, brokers, analytics, applications) each handling specific functions', 'A single server handling all IoT functions', 'Direct device-to-dashboard communication', 'A mesh network of identical sensor nodes'], correctIndex: 0 },
      { stem: 'What is the benefit of exposing parking availability through a public REST API?', options: ['It replaces the need for parking sensors', 'It allows third-party apps and citizens to access live parking data without accessing backend systems directly', 'It secures the parking sensor network', 'It stores parking data in a time-series database'], correctIndex: 1 },
    ],
  },
];

const CIRCUIT_QUESTION_SEEDS: CircuitQuestionSeed[] = [
  {
    id: 'circuit_1_pir_buzzer',
    title: 'Circuit 1 — PIR Motion Sensor with Buzzer',
    imageUrl: '/circuit_pics/Picture1.png',
    questions: [
      { stem: 'What does PIR stand for?', options: ['Printed Infrared', 'Passive Infrared', 'Pulsed Infrared', 'Programmable Infrared'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'What component produces the sound alert in this circuit?', options: ['LED', 'Resistor', 'Piezo Buzzer', 'Capacitor'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What colour are the 5V power wires in this circuit?', options: ['Black', 'Green', 'Blue', 'Red'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'What signal does the PIR sensor output when motion is detected?', options: ['Analog voltage', 'PWM', 'Digital HIGH (5V)', 'I2C data'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'Which component detects the presence of a person in this circuit?', options: ['Buzzer', 'Arduino Uno', 'Resistor', 'PIR Sensor'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'The dome-shaped lens on the PIR sensor that focuses infrared radiation is called:', options: ['Parabolic lens', 'Fresnel lens', 'Concave mirror', 'Diffraction grating'], correctIndex: 1, difficulty: 'Hard' },
      { stem: 'How many pins does a typical PIR sensor module have?', options: ['2', '4', '3', '6'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'Which Arduino pinMode() is set for the pin receiving the PIR OUTPUT?', options: ['OUTPUT', 'ANALOG', 'INPUT_PULLUP', 'INPUT'], correctIndex: 3, difficulty: 'Hard' },
      { stem: 'After detecting motion the PIR stays HIGH for a few seconds because of:', options: ['delay() in Arduino', 'Internal re-trigger time delay of the module', 'Buzzer feedback loop', 'Capacitor discharge'], correctIndex: 1, difficulty: 'Hard' },
      { stem: 'What is the typical maximum motion-detection range of a PIR sensor?', options: ['20 cm', 'Up to 7 meters', 'Exactly 1 meter', '50 meters'], correctIndex: 1, difficulty: 'Hard' },
    ],
  },
  {
    id: 'circuit_2_ldr_led',
    title: 'Circuit 2 — LDR Light Sensor with LED Control',
    imageUrl: '/circuit_pics/Picture2.png',
    questions: [
      { stem: 'What does LDR stand for?', options: ['Low Density Resistor', 'Light Dependent Resistor', 'Laser Detection Relay', 'Linear Digital Resistor'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'What type of Arduino pin reads the LDR value in this circuit?', options: ['Digital pin', 'GND pin', 'Analog pin (A0)', 'TX pin'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What output component is visible at the top-left of this circuit?', options: ['Green LED', 'Buzzer', 'Red LED', 'Infrared sensor'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What happens to LDR resistance when exposed to bright light?', options: ['Increases', 'Stays constant', 'Decreases', 'Becomes infinite'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'Which Arduino function reads the LDR analog value?', options: ['digitalRead()', 'analogRead()', 'pulseIn()', 'Serial.read()'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'What is the full range of values returned by analogRead() on Arduino Uno?', options: ['0-255', '0-100', '0-4095', '0-1023'], correctIndex: 3, difficulty: 'Hard' },
      { stem: 'Why is a fixed resistor paired with the LDR in this circuit?', options: ['To power the LDR', 'To form a voltage divider for analog reading', 'To filter visible light', 'To protect the 5V pin'], correctIndex: 1, difficulty: 'Hard' },
      { stem: 'When the room is completely dark, analogRead(A0) returns a value close to:', options: ['0', '512', '1023', '-1'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'Which real-world IoT application best uses this LDR circuit?', options: ['Heart rate monitor', 'Automatic street light', 'Motor speed control', 'GPS tracking'], correctIndex: 1, difficulty: 'Hard' },
      { stem: 'If the LDR is placed under direct bright sunlight, analogRead() returns a value close to:', options: ['1023', '0', '512', 'Negative'], correctIndex: 1, difficulty: 'Hard' },
    ],
  },
  {
    id: 'circuit_3_ultrasonic_lcd',
    title: 'Circuit 3 — HC-SR04 Ultrasonic Sensor with LCD and LED',
    imageUrl: '/circuit_pics/Picture3.png',
    questions: [
      { stem: 'What principle does the HC-SR04 use to measure distance?', options: ['Infrared reflection', 'Laser triangulation', 'Ultrasonic sound pulse echo', 'Magnetic field'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What display component is visible at the bottom of this circuit?', options: ['OLED screen', '7-segment display', '16x2 LCD display', 'TFT touch screen'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'How many pins does the HC-SR04 sensor have?', options: ['2', '3', '6', '4'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'Which HC-SR04 pin sends the ultrasonic trigger pulse?', options: ['ECHO', 'VCC', 'GND', 'TRIG'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'What is the operating voltage of the HC-SR04?', options: ['3.3V', '5V', '9V', '12V'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'Distance = (duration x 0.034) / 2. Why divide by 2?', options: ['Unit conversion', 'Arduino limitation', 'Sound travels to object and back', 'Sensor calibration'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'Which Arduino function measures the ECHO pulse duration in microseconds?', options: ['analogRead()', 'millis()', 'tone()', 'pulseIn()'], correctIndex: 3, difficulty: 'Hard' },
      { stem: 'Which library controls the 16x2 LCD in this circuit?', options: ['Wire.h', 'LiquidCrystal.h', 'SPI.h', 'Servo.h'], correctIndex: 1, difficulty: 'Hard' },
      { stem: 'What is the maximum reliable measuring range of the HC-SR04?', options: ['50 cm', '100 cm', '400 cm', '10 m'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'What is the required TRIG pulse duration to start an HC-SR04 measurement?', options: ['1 millisecond', '100 milliseconds', '1 second', '10 microseconds'], correctIndex: 3, difficulty: 'Hard' },
    ],
  },
  {
    id: 'circuit_4_pot_tmp',
    title: 'Circuit 4 — Potentiometer and TMP Temperature Sensor',
    imageUrl: '/circuit_pics/Picture4.png',
    questions: [
      { stem: 'What is the blue rotary component on the breadboard?', options: ['Capacitor', 'Potentiometer', 'Inductor', 'Relay'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'What does the TMP sensor measure in this circuit?', options: ['Humidity', 'Light intensity', 'Temperature', 'Pressure'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What type of output do both the potentiometer and TMP sensor provide?', options: ['Digital HIGH/LOW', 'PWM signal', 'I2C serial data', 'Analog voltage'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'Which Arduino function reads values from these sensors?', options: ['digitalRead()', 'analogRead()', 'pulseIn()', 'Wire.read()'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'What colour wires carry GND in this circuit?', options: ['Red', 'Green', 'Black', 'Yellow'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What is the output sensitivity of a typical TMP36 sensor?', options: ['1V per degree C', '100mV per degree C', '10mV per degree C', '0.1mV per degree C'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'With a potentiometer wiper at midpoint (5V supply), analogRead() returns:', options: ['0', '1023', '255', '512'], correctIndex: 3, difficulty: 'Hard' },
      { stem: 'To convert TMP36 analogRead() to Celsius, the correct formula is:', options: ['(reading x 5.0 / 1024 - 0.5) x 100', 'reading / 1023 x 100', 'reading x 0.488', '(reading - 500) / 10'], correctIndex: 0, difficulty: 'Hard' },
      { stem: 'What is the function of the middle (wiper) pin of the potentiometer?', options: ['Always outputs 5V', 'Always outputs GND', 'Outputs variable voltage based on rotation', 'Resets the circuit'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'What is the operating voltage range of a typical TMP36 sensor?', options: ['1.8V-5.5V', '6V-12V', '0.5V-2V', '5V only'], correctIndex: 0, difficulty: 'Hard' },
    ],
  },
  {
    id: 'circuit_5_traffic_light',
    title: 'Circuit 5 — Traffic Light LED Sequence',
    imageUrl: '/circuit_pics/Picture5.png',
    questions: [
      { stem: 'How many LEDs are visible on the breadboard in this circuit?', options: ['2', '3', '4', '5'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'What is the purpose of the resistor in series with each LED?', options: ['Increase brightness', 'Store charge', 'Limit current to protect the LED', 'Filter signal'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'What real-world system does this multi-LED circuit simulate?', options: ['Emergency alarm', 'Traffic light', 'Disco light', 'Sensor indicator'], correctIndex: 1, difficulty: 'Easy' },
      { stem: 'Which Arduino function turns each LED ON or OFF?', options: ['analogWrite()', 'digitalRead()', 'tone()', 'digitalWrite()'], correctIndex: 3, difficulty: 'Easy' },
      { stem: 'What colour wire carries 5V power to the breadboard in this circuit?', options: ['Black', 'Green', 'Red', 'Yellow'], correctIndex: 2, difficulty: 'Easy' },
      { stem: 'If each LED needs 20mA with 2V forward voltage and 5V supply, what resistor is needed?', options: ['100 ohm', '150 ohm', '220 ohm', '1k ohm'], correctIndex: 1, difficulty: 'Hard' },
      { stem: 'In a standard traffic light sequence, what is the correct LED order?', options: ['Red - Yellow - Green - Yellow - Red', 'Green - Red - Yellow', 'Yellow - Green - Red', 'Red - Blue - Green'], correctIndex: 0, difficulty: 'Hard' },
      { stem: 'How do you identify the Anode (positive leg) of an LED?', options: ['Shorter leg', 'Leg with flat edge on plastic', 'Longer leg', 'Both legs identical'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'What happens if two LEDs share one resistor in series?', options: ['Both glow brighter', 'Current doubles', 'Brightness reduces; one OFF affects the other', 'No effect'], correctIndex: 2, difficulty: 'Hard' },
      { stem: 'To blink an LED every 500ms, which delay value is correct?', options: ['delay(50)', 'delay(500)', 'delay(5000)', 'delay(5)'], correctIndex: 1, difficulty: 'Hard' },
    ],
  },
];

const COMMON_SOURCE_NODES = [
  'pir.out',
  'buzzer.signal',
  'led.anode',
  'servo.signal',
  'servo.vcc',
  'pir.vcc',
  'led.cathode',
  'buzzer.gnd',
  'pir.gnd',
  'servo.gnd',
];

const COMMON_TARGET_NODES = ['arduino.d2', 'arduino.d8', 'arduino.d7', 'arduino.d9', 'arduino.5v', 'arduino.gnd'];

interface SignalPinMap {
  pir: string;
  buzzer: string;
  led: string;
  servo: string;
}

function pinNumber(pin: string): string {
  return pin.replace('arduino.d', '');
}

function basicSnippetKeywords(): string[] {
  return [
    'pinmode(pir_pin, input)',
    'pinmode(led_pin, output)',
    'pinmode(buzzer_pin, output)',
    'doorlock.attach(servo_pin)',
    'digitalread(pir_pin)',
    'digitalwrite(led_pin, high)',
    'tone(buzzer_pin',
    'doorlock.write(90)',
    'digitalwrite(led_pin, low)',
    'notone(buzzer_pin)',
    'doorlock.write(0)',
  ];
}

function buildConnectionSeed(title: string, stem: string, pins: SignalPinMap): ConnectionQuestionSeed {
  return {
    title,
    stem,
    codeSnippet: `#include <Servo.h>\n\nconst int PIR_PIN = ${pinNumber(pins.pir)};\nconst int BUZZER_PIN = ${pinNumber(pins.buzzer)};\nconst int LED_PIN = ${pinNumber(pins.led)};\nconst int SERVO_PIN = ${pinNumber(pins.servo)};\n\nServo doorLock;\n\nvoid setup() {\n  pinMode(PIR_PIN, INPUT);\n  pinMode(BUZZER_PIN, OUTPUT);\n  pinMode(LED_PIN, OUTPUT);\n  doorLock.attach(SERVO_PIN);\n  doorLock.write(0);\n}\n\nvoid loop() {\n  if (digitalRead(PIR_PIN) == HIGH) {\n    digitalWrite(LED_PIN, HIGH);\n    tone(BUZZER_PIN, 2000);\n    doorLock.write(90);\n    delay(1000);\n  } else {\n    noTone(BUZZER_PIN);\n    digitalWrite(LED_PIN, LOW);\n    doorLock.write(0);\n  }\n}`,
    sourceNodes: COMMON_SOURCE_NODES,
    targetNodes: COMMON_TARGET_NODES,
    expectedConnections: [
      { from: 'pir.out', to: pins.pir },
      { from: 'buzzer.signal', to: pins.buzzer },
      { from: 'led.anode', to: pins.led },
      { from: 'servo.signal', to: pins.servo },
      { from: 'servo.vcc', to: 'arduino.5v' },
      { from: 'pir.vcc', to: 'arduino.5v' },
      { from: 'led.cathode', to: 'arduino.gnd' },
      { from: 'buzzer.gnd', to: 'arduino.gnd' },
      { from: 'pir.gnd', to: 'arduino.gnd' },
      { from: 'servo.gnd', to: 'arduino.gnd' },
    ],
  };
}

const CONNECTION_QUESTION_SEEDS: ConnectionQuestionSeed[] = [
  buildConnectionSeed(
    'Connection Task 1: Smart Intrusion Alarm Wiring',
    'Read the Arduino code and wire each module pin to the correct Arduino pin. This question is evaluated offline by graph-based connection validation.',
    { pir: 'arduino.d2', buzzer: 'arduino.d8', led: 'arduino.d7', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 2: Corridor Security Wiring',
    'Wire the PIR, buzzer, LED, and servo to match the given code constants for this corridor security setup.',
    { pir: 'arduino.d7', buzzer: 'arduino.d8', led: 'arduino.d2', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 3: Lab Door Guard Wiring',
    'Use the code pin assignments to complete the full module-to-Arduino wiring map.',
    { pir: 'arduino.d2', buzzer: 'arduino.d7', led: 'arduino.d8', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 4: Parking Gate Alert Wiring',
    'Connect all signal, power, and ground lines correctly according to the sketch.',
    { pir: 'arduino.d8', buzzer: 'arduino.d2', led: 'arduino.d7', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 5: Hostel Entry Alarm Wiring',
    'Complete the wiring based on this variation of the alarm logic pin constants.',
    { pir: 'arduino.d7', buzzer: 'arduino.d2', led: 'arduino.d8', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 6: Storage Room Lock Wiring',
    'Map each module pin to the expected Arduino endpoint shown by the code.',
    { pir: 'arduino.d8', buzzer: 'arduino.d7', led: 'arduino.d2', servo: 'arduino.d9' }
  ),
  buildConnectionSeed(
    'Connection Task 7: Office Alert Wiring',
    'Follow the pin constants and create a valid one-to-one signal wiring map.',
    { pir: 'arduino.d2', buzzer: 'arduino.d9', led: 'arduino.d7', servo: 'arduino.d8' }
  ),
  buildConnectionSeed(
    'Connection Task 8: Night Patrol Alarm Wiring',
    'Build the complete wiring map for this pin configuration and preserve all grounds.',
    { pir: 'arduino.d7', buzzer: 'arduino.d9', led: 'arduino.d2', servo: 'arduino.d8' }
  ),
  buildConnectionSeed(
    'Connection Task 9: Smart Locker Wiring',
    'Wire the components to match the constants and expected logic behavior.',
    { pir: 'arduino.d8', buzzer: 'arduino.d9', led: 'arduino.d2', servo: 'arduino.d7' }
  ),
  buildConnectionSeed(
    'Connection Task 10: Archive Room Alarm Wiring',
    'Use the provided code to derive and complete all required signal + power connections.',
    { pir: 'arduino.d9', buzzer: 'arduino.d2', led: 'arduino.d8', servo: 'arduino.d7' }
  ),
];

const SNIPPET_CODING_QUESTION_SEEDS: SnippetCodingSeed[] = CONNECTION_QUESTION_SEEDS.map((connection, index) => ({
  title: `Basic Snippet Coding ${index + 1}: Reverse From Wiring`,
  stem:
    'Given the wiring map below, write a basic Arduino snippet that reads PIR input and controls LED, buzzer, and servo lock. Keep it simple (setup + loop logic).',
  referenceConnections: connection.expectedConnections,
  requiredKeywords: basicSnippetKeywords(),
}));

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function toOptions(seed: { options: [string, string, string, string] }) {
  return seed.options.map((text, index) => ({ id: OPTION_IDS[index], text }));
}

function toMcqQuestion(seed: McqSeed, idx: number): BuiltQuestion {
  return {
    type: 'mcq',
    title: seed.title,
    scenario: seed.stem,
    section: 'A',
    difficulty: seed.difficulty === 'Easy' ? 'Easy' : 'Hard',
    score: 5,
    timeLimit: 60,
    options: toOptions(seed),
    correctAnswer: OPTION_IDS[seed.correctIndex],
  };
}

function ensureMixedDifficulty(mcqs: BuiltQuestion[]): BuiltQuestion[] {
  if (mcqs.length < 2) {
    return mcqs;
  }

  const firstTen = mcqs.slice(0, Math.min(10, mcqs.length));
  const allFirstTenEasy = firstTen.every((q) => q.difficulty === 'Easy');
  const allFirstTenHard = firstTen.every((q) => q.difficulty === 'Hard');

  if (!allFirstTenEasy && !allFirstTenHard) {
    return mcqs;
  }

  const oppositeDifficulty = allFirstTenEasy ? 'Hard' : 'Easy';
  const swapIndex = mcqs.findIndex((q, index) => index >= 10 && q.difficulty === oppositeDifficulty);
  if (swapIndex === -1) {
    return mcqs;
  }

  const updated = [...mcqs];
  const firstIndex = firstTen.findIndex((q) => q.difficulty !== oppositeDifficulty);
  const sourceIndex = firstIndex === -1 ? 0 : firstIndex;
  const temp = updated[sourceIndex];
  updated[sourceIndex] = updated[swapIndex];
  updated[swapIndex] = temp;
  return updated;
}

function toScenarioQuestions(scenarioSeed: ScenarioSeed): BuiltQuestion[] {
  return scenarioSeed.questions.map((q, index) => ({
    type: 'scenario-mcq',
    title: `${scenarioSeed.title} - Q${index + 1}`,
    scenario: `Story and Problem Statement:\n${scenarioSeed.prompt}\n\nQuestion:\n${q.stem}`,
    section: 'B',
    difficulty: 'Medium',
    score: 8,
    timeLimit: 90,
    options: toOptions(q),
    correctAnswer: OPTION_IDS[q.correctIndex],
    scenario_group: scenarioSeed.id,
  }));
}

function toCircuitQuestions(seed: CircuitQuestionSeed): BuiltQuestion[] {
  const circuitName = seed.title.replace(/^Circuit \d+\s*[—–-]+\s*/i, '');
  return seed.questions.map((q, index) => ({
    type: 'simulation',
    title: `${circuitName} - Q${index + 1}`,
    scenario: q.stem,
    section: 'C',
    difficulty: q.difficulty,
    score: q.difficulty === 'Easy' ? 5 : 8,
    timeLimit: 75,
    options: toOptions(q),
    correctAnswer: OPTION_IDS[q.correctIndex],
    scenario_group: seed.id,
    imageUrl: seed.imageUrl,
  }));
}

function toConnectionQuestion(seed: ConnectionQuestionSeed): BuiltQuestion {
  return {
    type: 'connection-evaluation',
    title: seed.title,
    scenario: seed.stem,
    section: 'C',
    difficulty: 'Hard',
    score: 20,
    timeLimit: 240,
    codeSnippet: seed.codeSnippet,
    sourceNodes: seed.sourceNodes,
    targetNodes: seed.targetNodes,
    expectedConnections: seed.expectedConnections,
    correctAnswer: JSON.stringify(
      seed.expectedConnections.reduce<Record<string, string>>((acc, edge) => {
        acc[edge.from] = edge.to;
        return acc;
      }, {})
    ),
  };
}

function toSnippetCodingQuestion(seed: SnippetCodingSeed): BuiltQuestion {
  const connectionLines = seed.referenceConnections
    .map((edge) => `- ${edge.from} -> ${edge.to}`)
    .join('\n');

  const findPin = (source: string, fallback: number) => {
    const target = seed.referenceConnections.find((edge) => edge.from === source)?.to;
    if (!target || !target.startsWith('arduino.d')) return String(fallback);
    return pinNumber(target);
  };

  return {
    type: 'snippet-coding',
    title: seed.title,
    scenario: `${seed.stem}\n\nReference connections:\n${connectionLines}`,
    section: 'D',
    difficulty: 'Medium',
    score: 20,
    timeLimit: 300,
    codeSnippet: `// Write your code here\nconst int PIR_PIN = ${findPin('pir.out', 2)};\nconst int BUZZER_PIN = ${findPin('buzzer.signal', 8)};\nconst int LED_PIN = ${findPin('led.anode', 7)};\nconst int SERVO_PIN = ${findPin('servo.signal', 9)};\n`,
    sourceNodes: COMMON_SOURCE_NODES,
    targetNodes: COMMON_TARGET_NODES,
    expectedConnections: seed.referenceConnections,
    correctAnswer: JSON.stringify(seed.requiredKeywords),
  };
}

function buildIdentityMatchAnswer(ids: string[]): string {
  return JSON.stringify(
    ids.reduce<Record<string, string>>((acc, id) => {
      acc[id] = id;
      return acc;
    }, {})
  );
}

function buildSection4ChallengeQuestions(): BuiltQuestion[] {
  const q1Pairs = [
    { id: 'application', left: 'Position 1 (Top)', right: 'Application Layer' },
    { id: 'middleware', left: 'Position 2', right: 'Middleware Layer' },
    { id: 'network', left: 'Position 3', right: 'Network Layer' },
    { id: 'perception', left: 'Position 4 (Bottom)', right: 'Perception Layer' },
  ];

  const q2Pairs = [
    { id: 'A', left: 'DHT22', right: 'Measures temperature and humidity' },
    { id: 'B', left: 'MQ-135', right: 'Detects gas, smoke, or air quality' },
    { id: 'C', left: 'Relay Module', right: 'Switches high-voltage devices using low-voltage signal' },
    { id: 'D', left: 'Servo Motor', right: 'Rotates to specific angles for precise movement' },
    { id: 'E', left: 'PIR Sensor', right: 'Detects motion using infrared' },
    { id: 'F', left: 'Ultrasonic Sensor', right: 'Measures distance using sound waves' },
    { id: 'G', left: 'ESP32', right: 'Microcontroller with built-in Wi-Fi and Bluetooth' },
    { id: 'H', left: 'Breadboard', right: 'Temporary platform for circuit prototyping' },
  ];

  const q3Pairs = [
    { id: 'A', left: 'LED', right: 'Digital Output' },
    { id: 'B', left: 'DHT22', right: 'OneWire / Digital Input' },
    { id: 'C', left: 'Servo Motor', right: 'Analog Output (PWM)' },
    { id: 'D', left: 'MQ-135 Gas Sensor', right: 'Analog Input' },
    { id: 'E', left: 'Push Button', right: 'Digital Input' },
    { id: 'F', left: 'HC-SR04 Ultrasonic Sensor', right: 'Trigger-Echo (GPIO)' },
    { id: 'G', left: '16x2 LCD Display (with I2C)', right: 'I2C' },
    { id: 'H', left: 'PIR Sensor', right: 'Digital Input' },
  ];

  const q4Pairs = [
    { id: 'D', left: 'Step 1', right: '#include <DHT.h>' },
    { id: 'H', left: 'Step 2', right: '#define DHTPIN 4' },
    { id: 'I', left: 'Step 3', right: '#define DHTTYPE DHT22' },
    { id: 'K', left: 'Step 4', right: 'DHT dht(DHTPIN, DHTTYPE);' },
    { id: 'J', left: 'Step 5', right: 'WiFi.begin(ssid, password);' },
    { id: 'F', left: 'Step 6', right: 'dht.begin();' },
    { id: 'B', left: 'Step 7', right: 'float temperature = dht.readTemperature();' },
    { id: 'E', left: 'Step 8', right: 'if (isnan(temperature)) { Serial.println("Failed"); return; }' },
    { id: 'C', left: 'Step 9', right: 'Serial.println(temperature);' },
    { id: 'G', left: 'Step 10', right: 'http.POST(temperature);' },
    { id: 'A', left: 'Step 11', right: 'delay(5000);' },
  ];

  const q5Pairs = [
    { id: 'AP', left: 'Smart Irrigation System', right: 'Soil Moisture Sensor + Water Pump' },
    { id: 'BQ', left: 'Automatic Street Light', right: 'LDR + LED' },
    { id: 'CR', left: 'Smoke Detection and Alarm', right: 'MQ-135 + Buzzer' },
    { id: 'DS', left: 'Smart Parking System', right: 'Ultrasonic Sensor + Servo Motor' },
    { id: 'ET', left: 'Temperature-Controlled Fan', right: 'DHT22 + DC Fan' },
  ];

  const q6Pairs = [
    { id: 'A1', left: 'Send sensor data to cloud every 2 seconds (low bandwidth)', right: 'MQTT' },
    { id: 'B2', left: 'Connect 3 sensors to one MCU using 2 wires', right: 'I2C' },
    { id: 'C3', left: 'Control LED from smartphone app (one-time command)', right: 'HTTP / REST API' },
    { id: 'D4', left: 'Short-range communication between two ESP32 modules', right: 'UART / Serial' },
    { id: 'B5', left: 'Connect OLED display to ESP32', right: 'I2C' },
    { id: 'E6', left: 'Stream video from camera module to web server', right: 'Wi-Fi / TCP/IP' },
  ];

  return [
    {
      type: 'matching',
      title: 'Interactive Challenge Q1: IoT Architecture Layer Arrangement',
      scenario: 'Arrange the IoT layers from top (user level) to bottom (physical device level).',
      section: 'D',
      difficulty: 'Medium',
      score: 4,
      timeLimit: 180,
      matchingPairs: q1Pairs,
      correctAnswer: buildIdentityMatchAnswer(q1Pairs.map((p) => p.id)),
    },
    {
      type: 'component-matching',
      title: 'Interactive Challenge Q2: Component Function Matching',
      scenario: 'Match each component to its primary function.',
      section: 'D',
      difficulty: 'Medium',
      score: 4,
      timeLimit: 240,
      matchingPairs: q2Pairs,
      correctAnswer: buildIdentityMatchAnswer(q2Pairs.map((p) => p.id)),
    },
    {
      type: 'component-matching',
      title: 'Interactive Challenge Q3: Interface and Connection Type Matching',
      scenario: 'Match each component to the interface/connection type used with the microcontroller.',
      section: 'D',
      difficulty: 'Medium',
      score: 4,
      timeLimit: 240,
      matchingPairs: q3Pairs,
      correctAnswer: buildIdentityMatchAnswer(q3Pairs.map((p) => p.id)),
    },
    {
      type: 'matching',
      title: 'Interactive Challenge Q4: Code Logic Sequencing',
      scenario: 'Arrange blocks in correct order for an IoT program (Wi-Fi + DHT22 + HTTP upload).',
      section: 'D',
      difficulty: 'Hard',
      score: 4,
      timeLimit: 360,
      matchingPairs: q4Pairs,
      correctAnswer: buildIdentityMatchAnswer(q4Pairs.map((p) => p.id)),
    },
    {
      type: 'matching',
      title: 'Interactive Challenge Q5: Sensor-Actuator Scenario Mapping',
      scenario: 'Match each scenario with the correct sensor and actuator pair.',
      section: 'D',
      difficulty: 'Hard',
      score: 4,
      timeLimit: 300,
      matchingPairs: q5Pairs,
      correctAnswer: buildIdentityMatchAnswer(q5Pairs.map((p) => p.id)),
    },
    {
      type: 'matching',
      title: 'Interactive Challenge Q6: Protocol and Communication Match (Bonus)',
      scenario: 'Bonus: Match each use case to the best communication protocol.',
      section: 'D',
      difficulty: 'Hard',
      score: 4,
      timeLimit: 240,
      matchingPairs: q6Pairs,
      correctAnswer: buildIdentityMatchAnswer(q6Pairs.map((p) => p.id)),
    },
  ];
}

export function getEasyMcqBank(): McqSeed[] {
  return EASY_MCQ_SEEDS.slice(0, 50);
}

export function getHardMcqBank(): McqSeed[] {
  return getEasyMcqBank().map((seed, index) => ({
    ...seed,
    title: seed.title,
    stem: seed.stem,
    difficulty: 'Hard',
  }));
}

export function getScenarioBank(): ScenarioSeed[] {
  return SCENARIO_SEEDS;
}

export function getConnectionQuestionBank(): ConnectionQuestionSeed[] {
  return CONNECTION_QUESTION_SEEDS;
}

export function getSnippetCodingQuestionBank(): SnippetCodingSeed[] {
  return SNIPPET_CODING_QUESTION_SEEDS;
}

export function getCircuitQuestionBank(): CircuitQuestionSeed[] {
  return CIRCUIT_QUESTION_SEEDS;
}

export function buildRound1QuestionSet(): Omit<Round1Question, 'id' | 'created_at'>[] {
  const easyChosen = shuffle(getEasyMcqBank()).slice(0, 10).map(toMcqQuestion);
  const hardChosen = shuffle(getHardMcqBank()).slice(0, 10).map(toMcqQuestion);

  const mixedMcq = ensureMixedDifficulty(shuffle([...easyChosen, ...hardChosen]));

  const selectedScenarios = shuffle(SCENARIO_SEEDS).slice(0, 2);
  const scenarioQuestions = selectedScenarios.flatMap((seed) => toScenarioQuestions(seed));

  const selectedCircuits = shuffle(CIRCUIT_QUESTION_SEEDS).slice(0, 2);
  const circuitQuestions = selectedCircuits.flatMap((seed) => toCircuitQuestions(seed));

  const section4Questions = buildSection4ChallengeQuestions();

  const questionSet = [...mixedMcq, ...scenarioQuestions, ...circuitQuestions, ...section4Questions];

  return questionSet.map((q, index) => ({
    ...q,
    section: index < 20 ? 'A' : index < 40 ? 'B' : index < 60 ? 'C' : 'D',
  }));
}

export function buildRound1QuestionBankForSqlite(): Omit<Round1Question, 'id' | 'created_at'>[] {
  const mcqAll = [
    ...getEasyMcqBank().map((q) => toMcqQuestion(q, 0)),
    ...getHardMcqBank().map((q) => toMcqQuestion(q, 0)),
  ];

  const scenarioAll = SCENARIO_SEEDS.flatMap((s) => toScenarioQuestions(s));
  const circuit = CIRCUIT_QUESTION_SEEDS.flatMap((seed) => toCircuitQuestions(seed));
  const section4 = buildSection4ChallengeQuestions();

  return [...mcqAll, ...scenarioAll, ...circuit, ...section4];
}
