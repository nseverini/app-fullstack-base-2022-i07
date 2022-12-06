class Device {
  public id?: number;
  public name: string;
  public state?: number;
  public description: string;
  public type: DeviceType;
}

enum DeviceType {
  lightbulb_outline = 0,
  window_closed = 1,
  toys_fan = 2,
  tv = 3,
  audiotrack = 4,
  ac_unit = 5,
  outlet = 7,
}
