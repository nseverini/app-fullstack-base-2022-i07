interface HandlerResponse {
  loadDevices(devices: Array<Device>): void;
  addDevice(device: Device): void;
  updateDevice(device: Device): void;
  removeDevice(id: number): void;
  showError(message: string): void;
}
