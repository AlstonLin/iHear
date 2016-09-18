
// Assume: 1 - left, 2 - middle, 3 - right

#define MIC_1 A1
#define MIC_2 A2
#define MIC_3 A3

int MIC_OUT_1 = 3;
int MIC_OUT_2 = 5;
int MIC_OUT_3 = 6;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(MIC_OUT_1, OUTPUT);  
  pinMode(MIC_OUT_2, OUTPUT);
  pinMode(MIC_OUT_3, OUTPUT);
  Serial.println("Initialized");
}

void loop() {
  // put your main code here, to run repeatedly:
  int value1 = analogRead(MIC_1);
  delay(50);
  int value2 = analogRead(MIC_2);
  delay(50);
  int value3 = analogRead(MIC_3);

  value1 /= 5;
  value2 /= 5;
  value3 /= 5;

  //delay(50);
  Serial.println("-----");
  //delay(50);
  Serial.println(value1);
  analogWrite(MIC_OUT_1, value1);
 // delay(50);
  Serial.println(value2);
  analogWrite(MIC_OUT_2, value2);
 // delay(50);
  Serial.println(value3);
  analogWrite(MIC_OUT_3, value3);
  delay(100); 
}

