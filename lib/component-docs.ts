// Component documentation and setup instructions
// This file contains detailed setup information for each component

export const componentDocumentation: Record<
  number,
  {
    setup_instructions: string;
    default_pins?: Record<string, number>;
    connection_diagram?: string;
    warnings?: string[];
    required_libraries?: string[];
    estimated_setup_time?: number;
    complexity_level?: 'Beginner' | 'Intermediate' | 'Advanced';
  }
> = {
  // 1. Micro SD Card
  1: {
    complexity_level: 'Intermediate',
    estimated_setup_time: 15,
    setup_instructions: `1. Insert Micro SD Card into SD Card reader
2. Connect SD Card Module to Arduino:
   - VCC → Arduino 5V
   - GND → Arduino GND
   - MOSI → Arduino Pin 11
   - MISO → Arduino Pin 12
   - SCK → Arduino Pin 13
   - CS → Arduino Pin 10
3. Format SD Card as FAT32 if needed
4. Load SD library example in Arduino IDE
5. Verify CS pin matches your setup
6. Test with basic file read/write operations`,
    default_pins: {
      'VCC': 5,
      'GND': 0,
      'MOSI': 11,
      'MISO': 12,
      'SCK': 13,
      'CS': 10,
    },
    connection_diagram: 'SD Module → SPI Bus (Pins 10-13) with 5V supply',
    warnings: [
      'Use 3.3V regulator if SD module operates at 3.3V',
      'Maximum SPI frequency: 4 MHz',
      'Ensure CS pin is always pulled high before communication',
    ],
    required_libraries: ['SD.h', 'SPI.h'],
  },

  // 2. Card Reader USB
  2: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. No Arduino connection required
2. Use standard USB port on development PC
3. Connect USB 3.1 Gen 1 Cable from Card Reader to PC
4. Insert SD/MicroSD Card into reader slot
5. Card appears as mass storage device
6. Use system file manager for file access`,
    connection_diagram: 'Direct USB connection to computer',
    warnings: [
      'Ensure USB 3.1 compatibility with your system',
      'Do not hot-swap cards while active',
      'Close all file access before ejecting card',
    ],
    required_libraries: [],
  },

  // 3. Small Servo Motor
  3: {
    complexity_level: 'Beginner',
    estimated_setup_time: 10,
    setup_instructions: `1. Identify servo connections:
   - Orange: Signal (PWM)
   - Red: Power (5V)
   - Brown: Ground
2. Connect to Arduino:
   - Signal → Arduino Pin 9 (PWM pin)
   - Power → Arduino 5V
   - Ground → Arduino GND
3. Include Servo library
4. Create Servo object and attach to pin
5. Use servo.write(angle) to set position (0-180 degrees)
6. Test sweep motion before integration`,
    default_pins: {
      'Signal': 9,
      'Power': 5,
      'Ground': 0,
    },
    connection_diagram: 'Three-wire servo connector to Arduino PWM pin 9, 5V, and GND',
    warnings: [
      'Use PWM-capable pins only (3, 5, 6, 9, 10, 11)',
      'Servo stalls at full torque - protect from over-load',
      'Position updates less than 20ms may cause jitter',
    ],
    required_libraries: ['Servo.h'],
  },

  // 4. DC Motor
  4: {
    complexity_level: 'Intermediate',
    estimated_setup_time: 20,
    setup_instructions: `1. Use motor driver module (L298N recommended)
2. Connect Motor Driver to Arduino:
   - IN1 → Arduino Pin 8
   - IN2 → Arduino Pin 9
   - EN → Arduino Pin 5 (PWM for speed)
   - GND → Arduino GND
3. Connect motor power from external supply:
   - Motor+ → OUT1 (Motor Driver)
   - Motor- → OUT2 (Motor Driver)
4. Use analogWrite() for speed control (0-255)
5. Digital pins control direction
6. Test under no-load first`,
    default_pins: {
      'IN1': 8,
      'IN2': 9,
      'Enable': 5,
    },
    connection_diagram: 'DC Motor ↔ L298N Motor Driver ↔ Arduino + External Power Supply',
    warnings: [
      'Use external power supply for motor (do not use Arduino 5V alone)',
      'Add flyback diode across motor terminals',
      'Keep motor current separate from Arduino circuit',
      'Test motor direction before securing in place',
    ],
    required_libraries: [],
  },

  // 5. Piezo Capsule
  5: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. Connect Piezo to Arduino:
   - Positive (+) → Arduino Pin 8
   - Negative (-) → Arduino GND
2. Use tone() function for beeping
3. Syntax: tone(pin, frequency, duration)
4. Frequency range: 20Hz to 20,000Hz
5. Test with simple melody patterns
6. Add capacitor (0.1µF) across terminals if noise occurs`,
    default_pins: {
      'Positive': 8,
      'Negative': 0,
    },
    connection_diagram: 'Piezo Capsule directly to digital pin with 220Ω resistor (optional)',
    warnings: [
      'Limit volume - can be loud (>80dB)',
      'Best frequency range: 2000Hz - 5000Hz',
      'Do not exceed duty cycle limits to prevent damage',
    ],
    required_libraries: [],
  },

  // 6. LDR (Photo Resistor)
  6: {
    complexity_level: 'Beginner',
    estimated_setup_time: 10,
    setup_instructions: `1. Create voltage divider circuit:
   - LDR one terminal → Arduino 5V
   - LDR other terminal → 10K resistor → Arduino GND
   - Analog input → Arduino A0 (from junction between LDR and resistor)
2. In Arduino code:
   - Read with analogRead(A0)
   - Returns 0-1023 based on light intensity
3. Calibrate thresholds for your lighting conditions
4. Values: Dark <300, Dim 300-600, Bright >600 (typical)
5. Add delay between readings to reduce noise`,
    default_pins: {
      'Signal': 'A0',
      'VCC': 5,
      'GND': 0,
    },
    connection_diagram: 'LDR in voltage divider with 10K resistor to Arduino analog pin',
    warnings: [
      'LDR sensitivity varies with light spectrum',
      'Use consistent lighting conditions for calibration',
      'Add capacitor (0.1µF) for noise filtering if needed',
    ],
    required_libraries: [],
  },

  // 7. Potentiometer
  7: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. Connect Potentiometer to Arduino:
   - Left pin → Arduino GND
   - Middle pin → Arduino A0
   - Right pin → Arduino 5V
2. Read with analogRead(A0)
3. Value range: 0-1023 (low to high resistance)
4. Map values with map() function if needed
5. Use map(value, 0, 1023, minOut, maxOut) for scaling
6. Test full rotation for consistency`,
    default_pins: {
      'GND': 0,
      'Signal': 'A0',
      'VCC': 5,
    },
    connection_diagram: 'Potentiometer middle pin to analog input, outer pins to power/ground',
    warnings: [
      'Never exceed 5V on analog inputs',
      'Add 0.1µF capacitor to signal pin for noise reduction',
      'Check potentiometer range (usually 0-270°)',
    ],
    required_libraries: [],
  },

  8: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. Connect one side of pushbutton to Arduino digital pin (e.g., D2)
2. Connect the opposite side to GND
3. Use INPUT_PULLUP in code to avoid floating input
4. Read LOW as pressed and HIGH as released
5. Debounce button in software using millis()`,
    default_pins: {
      'Signal': 2,
      'GND': 0,
    },
    connection_diagram: 'Pushbutton between digital input and GND with INPUT_PULLUP',
    warnings: [
      'Without debouncing, multiple false triggers may occur',
      'Do not leave digital input floating',
    ],
    required_libraries: [],
  },

  10: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. Connect LED anode through 220 ohm resistor to Arduino digital pin
2. Connect LED cathode to GND
3. Set pinMode(pin, OUTPUT)
4. Use digitalWrite or PWM for blink/fade effects`,
    default_pins: {
      'Anode': 9,
      'Cathode': 0,
    },
    connection_diagram: 'Arduino output -> 220 ohm resistor -> LED anode, LED cathode -> GND',
    warnings: [
      'Always use current-limiting resistor',
      'Reversed polarity prevents LED from lighting',
    ],
    required_libraries: [],
  },

  11: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. Connect LED anode via 220 ohm resistor to Arduino digital pin
2. Connect cathode to GND
3. Configure the pin as OUTPUT in setup()
4. Use HIGH/LOW or PWM as needed`,
    default_pins: {
      'Anode': 10,
      'Cathode': 0,
    },
    connection_diagram: 'Arduino output -> resistor -> green LED -> GND',
    warnings: [
      'Use resistor to avoid overcurrent',
    ],
    required_libraries: [],
  },

  12: {
    complexity_level: 'Beginner',
    estimated_setup_time: 5,
    setup_instructions: `1. Connect LED anode via 220 ohm resistor to Arduino digital pin
2. Connect cathode to GND
3. Configure pin as OUTPUT in setup()
4. Drive HIGH/LOW for status indication`,
    default_pins: {
      'Anode': 11,
      'Cathode': 0,
    },
    connection_diagram: 'Arduino output -> resistor -> yellow LED -> GND',
    warnings: [
      'Use resistor to avoid LED damage',
    ],
    required_libraries: [],
  },

  18: {
    complexity_level: 'Beginner',
    estimated_setup_time: 3,
    setup_instructions: `1. Place resistor in series with LED or signal path
2. Confirm value using color bands (Red-Red-Brown)
3. Use resistor in current limiting and divider circuits`,
    connection_diagram: 'Series protection or voltage divider usage',
    warnings: [
      'Incorrect resistance value can overdrive components',
    ],
    required_libraries: [],
  },

  26: {
    complexity_level: 'Beginner',
    estimated_setup_time: 10,
    setup_instructions: `1. Connect HC-SR04 VCC to 5V and GND to ground
2. Connect Trig to digital output pin and Echo to digital input pin
3. Send 10us pulse on Trig to start measurement
4. Read echo pulse width and convert to distance`,
    default_pins: {
      'Trig': 9,
      'Echo': 10,
      'VCC': 5,
      'GND': 0,
    },
    connection_diagram: 'HC-SR04 Trig/Echo to digital pins with 5V power',
    warnings: [
      'Keep sensor clear from angled surfaces for stable readings',
      'Echo pin timing can block if no echo is received',
    ],
    required_libraries: [],
  },

  27: {
    complexity_level: 'Beginner',
    estimated_setup_time: 8,
    setup_instructions: `1. Connect VCC to 5V, GND to ground, and OUT to digital input pin
2. Wait warm-up period (~30-60 seconds) after powering sensor
3. Read OUT pin HIGH for motion, LOW for idle
4. Tune sensitivity/time-delay potentiometers if available`,
    default_pins: {
      'OUT': 2,
      'VCC': 5,
      'GND': 0,
    },
    connection_diagram: 'PIR OUT to digital input with 5V/GND supply',
    warnings: [
      'Initial warm-up can produce unstable output',
      'Avoid placing near heat sources',
    ],
    required_libraries: [],
  },

  30: {
    complexity_level: 'Intermediate',
    estimated_setup_time: 12,
    setup_instructions: `1. Connect relay module VCC and GND to Arduino power rails
2. Connect IN pin to chosen digital output pin
3. Connect load through COM and NO/NC terminals as required
4. Use digitalWrite to switch relay state`,
    default_pins: {
      'IN': 7,
      'VCC': 5,
      'GND': 0,
    },
    connection_diagram: 'Arduino digital output controls relay IN; load wired via COM/NO',
    warnings: [
      'Handle high-voltage loads with proper isolation',
      'Many relay modules are active LOW',
    ],
    required_libraries: [],
  },

  33: {
    complexity_level: 'Beginner',
    estimated_setup_time: 8,
    setup_instructions: `1. Connect VCC to 5V, GND to GND, and OUT to a digital input pin
2. Place sensor so emitter/receiver faces door path or obstacle path
3. Read digital output state for beam obstruction detection
4. Calibrate sensitivity potentiometer if available`,
    default_pins: {
      'OUT': 2,
      'VCC': 5,
      'GND': 0,
    },
    connection_diagram: 'IR sensor OUT to digital input, powered by 5V and GND',
    warnings: [
      'Strong ambient sunlight can affect reliability',
      'Align sensor direction for repeatable detection',
    ],
    required_libraries: [],
  },

  // Add more components as needed...
  // 8-49: Additional components follow similar pattern
};

// Get documentation for a component
export function getComponentDocumentation(componentId: number) {
  return componentDocumentation[componentId] || null;
}

// Get all documentation
export function getAllComponentDocumentation() {
  return componentDocumentation;
}
