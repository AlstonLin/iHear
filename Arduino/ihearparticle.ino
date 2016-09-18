#define MIC_1 A1
#define MIC_2 A2
#define MIC_3 A3

UDP Udp;

IPAddress remoteIP(45, 79, 129, 160);
int port = 8888;

byte buffer [] = {0,0,0,0};

void setup() {
  Udp.begin(8888);
  Serial.begin(9600);
}
int past[80] = {};
int total[3] = {0,0,0};
int count = 0;

// Idea: either one of p1..3 is incremented based on the largest v1..3 values
// we also only care about the last 80 measures obtained

void loop() {
    ++count;
    
    byte v1 = analogRead(MIC_1);
    delay(10);
    byte v2 = analogRead(MIC_2);
    delay(10);
    byte v3 = analogRead(MIC_3);
    delay(10);
    
    // http://provideyourown.com/2011/analogwrite-convert-pwm-to-voltage/
    double volt = (5.0 * v1) / 1023.0;
    v1 = 255 * (volt / 5.0);
    
    volt = (5.0 * v2) / 1023.0;
    v2 = 255 * (volt / 5.0);
    
    volt = (5.0 * v3) / 1023.0;
    v3 = 255 * (volt / 5.0);
    
    
    if(count>80){
        --total[past[0]];
        // TODO - learn how to implement linked-list in Arduino
        for(int i = 1; i<80; ++i){
            past[i-1] = past[i];
        }
    }
    
    if(v1 == max(max(v1, v2), v3)){
            ++total[0];
            past[79] = 0;
    }
    else if(v3 == max(max(v1, v2), v3)){
            ++total[2];
            past[79] = 2;
    }
    else{
            ++total[1];
            past[79] = 1;
    }
    
        Serial.println("-----");
        Serial.println(v1);
        Serial.println(v2);
        Serial.println(v3);
    
            if(total[0] == max(max(total[0], total[1]), total[2])){
                buffer[0] = 0;
            }
            else if(total[2] == max(max(total[0], total[1]), total[2])){
                buffer[0] = 2;
            }
            else{
                buffer[0] = 1;
            }
        Serial.println(buffer[0]);
    
    
        if (Udp.sendPacket(buffer, sizeof(buffer), remoteIP, port) < 0) {
            Particle.publish("Error");
        }
        delay(50);
}

