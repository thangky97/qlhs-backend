const CameraRoute = require('./CameraRoute');

module.exports = [
  { method: "POST", path: "/camera/insert", config: CameraRoute.insert },
  { method: "POST", path: "/camera/update", config: CameraRoute.updateCamera },
  { method: "POST", path: "/camera/get-intersection", config: CameraRoute.getIntersectionCamera },
  { method: "POST", path: "/camera/get-available", config: CameraRoute.getCameraAvailable },
  { method: "POST", path: "/camera/delete", config: CameraRoute.deleteCamera },
]