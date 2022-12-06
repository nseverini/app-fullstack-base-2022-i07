class Framework {
  public executeRequest(
    method: string,
    url: string,
    responseHandler: HandlerResponse,
    data?: any
  ): void {
    this.showSpinner();

    const xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          if (method == "GET") {
            const devices: Array<Device> = JSON.parse(xmlHttp.responseText);
            responseHandler.loadDevices(devices);
          } else if (method == "POST") {
            const device: Device = JSON.parse(xmlHttp.responseText);
            responseHandler.addDevice(device);
          } else if (method == "PUT") {
            const device: Device = JSON.parse(xmlHttp.responseText);
            responseHandler.updateDevice(device);
          } else if (method == "DELETE") {
            const id: number = Number(JSON.parse(xmlHttp.responseText));
            responseHandler.removeDevice(id);
          }
        } else {
          responseHandler.showError("Error in request");
        }

        this.hideSpinner();
      }
    };
    xmlHttp.open(method, url, true);

    if (data != undefined) {
      xmlHttp.setRequestHeader("Content-Type", "application/json");
      xmlHttp.send(JSON.stringify(data));
    } else {
      xmlHttp.send();
    }
  }

  private showSpinner(): void {
    let spinner = document.getElementById("spinner");
    spinner.classList.add("active");
  }

  private hideSpinner(): void {
    let spinner = document.getElementById("spinner");
    spinner.classList.remove("active");
  }
}
