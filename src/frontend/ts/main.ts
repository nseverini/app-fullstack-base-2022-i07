declare const M;

class Main implements EventListenerObject, HandlerResponse {
  private framework: Framework = new Framework();
  private devices: Device[];
  private apiUrl: string = "http://localhost:8000/api/devices";

  constructor() {
    this.getDevices();
  }

  // Request to API to get all the devices
  private getDevices(): void {
    this.framework.executeRequest("GET", this.apiUrl, this);
  }

  // Request to API to update a device
  private putDevice(device: Device): void {
    this.framework.executeRequest(
      "PUT",
      `${this.apiUrl}/${device.id}`,
      this,
      device
    );
  }

  // Request to API to create a device
  private createDevice(device: Device): void {
    this.framework.executeRequest("POST", this.apiUrl, this, device);
  }

  // Request to API to delete a device
  private deleteDevice(id: number): void {
    this.framework.executeRequest("DELETE", `${this.apiUrl}/${id}`, this);
  }

  // Show an error message
  public showError(message: string): void {
    M.toast({ html: message });
  }

  // Push a device to array and executes renderDevices method. Show a toast for confirm the operation
  public addDevice(device: Device): void {
    this.devices.push(device);
    this.renderDevices([device]);
    M.toast({ html: `Device ${device.id} created succesfully` });
  }

  // Update a specific device from array and executes renderDeviceUpdated method. Show a toast for confirm the operation
  public updateDevice(device: Device): void {
    const deviceIndex = this.devices.findIndex(
      (d) => d.id == Number(device.id)
    );
    this.devices[deviceIndex] = device;
    this.renderDeviceUpdated(device);
    M.toast({ html: `Device ${device.id} updated succesfully` });
  }

  // Remove a specific device from array and DOM. Show a toast for confirm the operation
  public removeDevice(id: number): void {
    const deviceIndex = this.devices.findIndex((d) => d.id == Number(id));
    this.devices.splice(deviceIndex, 1);

    const deviceCard = document.getElementById(`device_${id}`);
    deviceCard.remove();

    M.toast({ html: `Device ${id} deleted succesfully` });
  }

  // Set devices array and executes renderDevices method
  public loadDevices(devices: Device[]): void {
    this.devices = devices;
    this.renderDevices(devices);
  }

  // Render list of devices in DOM
  private renderDevices(devices: Device[]): void {
    const deviceWrapperElement: HTMLElement =
      document.getElementById("device-wrapper");
    let deviceCardList: string = "";

    for (const device of devices) {
      let deviceToggle: string;
      if (
        device.type == DeviceType.ac_unit ||
        device.type == DeviceType.toys_fan ||
        device.type == DeviceType.window_closed
      ) {
        deviceToggle = `
          <p class="range-field">
              <input type="range" id="range_${device.id}" min="0" max="100" value="${device.state}" />
          </p>
      `;
      } else {
        if (device.state) {
          deviceToggle = `
          <div class="switch">
              <label>
                  <input type="checkbox" id="switch_${device.id}" checked/>
                  <span class="lever"></span>
              </label>
          </div>`;
        } else {
          deviceToggle = `
          <div class="switch">
              <label>
                  <input type="checkbox" id="switch_${device.id}" />
                  <span class="lever"></span>
              </label>
          </div>`;
        }
      }

      const deviceCard: string = `
      <div id="device_${device.id}" class="col s12 m6 l4">
          <div class="card indigo darken-1">
              <div class="card-content white-text">
                  <i id="device-icon_${
                    device.id
                  }" class="material-symbols-outlined">
                      ${DeviceType[device.type]}
                  </i>
                  <span id="device-name_${device.id}" class="card-title">
                    ${device.name}
                  </span>
                  <p id="device-description_${
                    device.id
                  }" class="card-description">
                    ${device.description}
                  </p>
                  <div id="device-toggle_${device.id}">
                    ${deviceToggle}
                  </div>
              </div>
              <div class="card-action">
                  <button id="edit_${
                    device.id
                  }" data-target="modal-update" class="btn darken-1 waves-effect waves-light modal-trigger">Update</button>
                  <button id="delete_${
                    device.id
                  }" class="btn darken-1 waves-effect waves-light">Delete</button>
              </div>
          </div>
      </div>
    `;
      deviceCardList += deviceCard;
    }

    deviceWrapperElement.innerHTML += deviceCardList;

    for (let device of devices) {
      let deviceToggle;
      if (
        device.type == DeviceType.ac_unit ||
        device.type == DeviceType.toys_fan ||
        device.type == DeviceType.window_closed
      ) {
        deviceToggle = document.getElementById(`range_${device.id}`);
      } else {
        deviceToggle = document.getElementById(`switch_${device.id}`);
      }

      deviceToggle.addEventListener("click", this);

      const deviceDelete = document.getElementById(`delete_${device.id}`);
      deviceDelete.addEventListener("click", this);

      const deviceUpdate = document.getElementById(`edit_${device.id}`);
      deviceUpdate.addEventListener("click", this);
    }
  }

  // Update the values in DOM for a rendered device
  private renderDeviceUpdated(device: Device): void {
    document.getElementById(`device-name_${device.id}`).innerHTML = device.name;
    document.getElementById(`device-description_${device.id}`).innerHTML =
      device.description;
    document.getElementById(`device-icon_${device.id}`).innerHTML =
      DeviceType[device.type];

    let deviceToggle;
    const deviceToggleWrapperElement: HTMLElement = document.getElementById(
      `device-toggle_${device.id}`
    );
    if (
      device.type == DeviceType.ac_unit ||
      device.type == DeviceType.toys_fan ||
      device.type == DeviceType.window_closed
    ) {
      deviceToggle = document.getElementById(`switch_${device.id}`);
      if (deviceToggle) {
        deviceToggle = `
          <p class="range-field">
              <input type="range" id="range_${device.id}" min="0" max="100" value="${device.state}" />
          </p>
        `;

        deviceToggleWrapperElement.innerHTML = deviceToggle;

        deviceToggle = document.getElementById(`range_${device.id}`);
        deviceToggle.addEventListener("click", this);
      }
    } else {
      deviceToggle = document.getElementById(`range_${device.id}`);

      if (deviceToggle) {
        if (device.state) {
          deviceToggle = `
          <div class="switch">
              <label>
                  <input type="checkbox" id="switch_${device.id}" checked/>
                  <span class="lever"></span>
              </label>
          </div>`;
        } else {
          deviceToggle = `
          <div class="switch">
              <label>
                  <input type="checkbox" id="switch_${device.id}" />
                  <span class="lever"></span>
              </label>
          </div>`;
        }

        deviceToggleWrapperElement.innerHTML = deviceToggle;
        deviceToggle = document.getElementById(`switch_${device.id}`);
        deviceToggle.addEventListener("click", this);
      }
    }
  }

  // Handler for events
  public handleEvent(object: Event): void {
    let event: HTMLElement;
    event = <HTMLElement>object.target;

    if (event.id.startsWith("switch_")) {
      const value = Number((<HTMLInputElement>event).checked);
      const idDevice = Number(event.id.replace("switch_", ""));
      this.handleUpdateStateDevice(idDevice, value);
    } else if (event.id.startsWith("range_")) {
      const value = Number((<HTMLInputElement>event).value);
      const idDevice = Number(event.id.replace("range_", ""));
      this.handleUpdateStateDevice(idDevice, value);
    } else if (event.id == "submit-create") {
      this.handleCreateDevice();
    } else if (event.id == "submit-update") {
      this.handleUpdateDevice();
    } else if (event.id.startsWith("delete_")) {
      const idDevice = Number(event.id.replace("delete_", ""));
      this.handleDeleteDevice(idDevice);
    } else if (event.id.startsWith("edit_")) {
      const idDevice = Number(event.id.replace("edit_", ""));
      this.handleModalUpdateDevice(idDevice);
    }
  }

  // Updates device list and executes putDevice method
  private handleUpdateStateDevice(id: number, value: number): void {
    const deviceIndex = this.devices.findIndex((d) => d.id == id);
    const device = this.devices[deviceIndex];
    device.state = value;
    this.putDevice(device);
  }

  // Get form elements value and executes createDevice method
  private handleCreateDevice(): void {
    const nameValue = (<HTMLInputElement>document.getElementById("name-create"))
      .value;
    const descriptionValue = (<HTMLTextAreaElement>(
      document.getElementById("description-create")
    )).value;
    const typeValue = (<HTMLSelectElement>(
      document.getElementById("type-create")
    )).value;

    const device: Device = {
      name: nameValue,
      description: descriptionValue,
      type: Number(typeValue),
    };

    if (this.deviceDataIsValid(device)) {
      this.createDevice(device);

      const modalElement = document.getElementById("modal-create");
      const modalInstance = M.Modal.getInstance(modalElement);
      modalInstance.close();

      this.resetForm();
    } else {
      this.showError("Device data is invalid");
    }
  }

  // Set values of update form elements and executes putDevice method
  private handleUpdateDevice(): void {
    const idValue = Number(
      (<HTMLInputElement>document.getElementById("id-update")).value
    );
    const nameValue = (<HTMLInputElement>document.getElementById("name-update"))
      .value;
    const descriptionValue = (<HTMLTextAreaElement>(
      document.getElementById("description-update")
    )).value;
    const typeValue = (<HTMLSelectElement>(
      document.getElementById("type-update")
    )).value;

    const deviceIndex = this.devices.findIndex((d) => d.id == idValue);
    const stateValue = this.devices[deviceIndex].state;

    const device: Device = {
      id: idValue,
      name: nameValue,
      description: descriptionValue,
      type: Number(typeValue),
      state: stateValue,
    };

    if (this.deviceDataIsValid(device)) {
      this.putDevice(device);

      const modalElement = document.getElementById("modal-update");
      const modalInstance = M.Modal.getInstance(modalElement);
      modalInstance.close();

      this.resetForm();
    } else {
      this.showError("Device data is invalid");
    }
  }

  private handleDeleteDevice(id: number): void {
    this.deleteDevice(id);
  }

  // Set values of update form elements and executes updateFormMaterialize method
  private handleModalUpdateDevice(id: number): void {
    const deviceIndex = this.devices.findIndex((d) => d.id == id);
    const device = this.devices[deviceIndex];
    (<HTMLInputElement>document.getElementById("id-update")).value = String(
      device.id
    );
    (<HTMLInputElement>document.getElementById("name-update")).value =
      device.name;
    (<HTMLTextAreaElement>document.getElementById("description-update")).value =
      device.description;
    (<HTMLSelectElement>document.getElementById("type-update")).value = String(
      device.type
    );
    this.updateFormMaterialize();
  }

  // Reset form elements of modal and executes updateFormMaterialize method
  private resetForm(): void {
    (<HTMLInputElement>document.getElementById("name-create")).value = null;
    (<HTMLTextAreaElement>document.getElementById("description-create")).value =
      null;
    (<HTMLSelectElement>(
      document.getElementById("type-create")
    )).selectedIndex = 0;
    this.updateFormMaterialize();
  }

  // Update the rendered values in DOM of Materialize form elements
  private updateFormMaterialize(): void {
    M.updateTextFields();
    const selectElements = document.querySelectorAll("select");
    M.FormSelect.init(selectElements, "");
  }

  // Checks if device data is valid
  private deviceDataIsValid(device: Device): boolean {
    return (
      "name" in device &&
      device.name !== "" &&
      "description" in device &&
      device.description !== "" &&
      "type" in device &&
      device.type in DeviceType
    );
  }
}

// Listener for when the page load
window.addEventListener("load", () => {
  const modalElements = document.querySelectorAll(".modal");
  M.Modal.init(modalElements, "");

  const selectElements = document.querySelectorAll("select");
  M.FormSelect.init(selectElements, "");

  const main: Main = new Main();

  const buttonSubmit = document.getElementById("submit-create");
  buttonSubmit.addEventListener("click", main);

  const buttonUpdate = document.getElementById("submit-update");
  buttonUpdate.addEventListener("click", main);
});
