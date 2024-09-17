const QTrafficControlInfoRoute = require('./Q_Traffic_Control_Info');
const QTrafficStatus = require('./Q_Traffic_Status');
const SettingMonitoring = require('./Setting_Monitoring');
const QTrafficMedia = require('./Q_Traffic_Media');

module.exports = [
  { path: '/q-traffic-control-info/insert', method: 'POST', config: QTrafficControlInfoRoute.insert },
  { path: '/q-traffic-control-info/get', method: 'POST', config: QTrafficControlInfoRoute.get },
  { path: '/q-traffic-control-info/report-error', method: 'POST', config: QTrafficControlInfoRoute.reportError },


  { path: '/q-traffic-status/get', method: 'POST', config: QTrafficStatus.getQTrafficStatus },
  { path: '/q-traffic-status/exportData', method: 'POST', config: QTrafficStatus.exportData },

  { path: '/q-traffic-media/get', method: 'POST', config: QTrafficMedia.getQTrafficMedia }
  ,

  { path: '/q-traffic-media/insert', method: 'POST', config: QTrafficMedia.insert },
  { path: '/q-traffic-media/robot-insert-media', method: 'POST', config: QTrafficMedia.robotInsertMedia },
  
  { path: '/q-traffic-status/insert', method: 'POST', config: QTrafficStatus.insert },
  { path: '/q-traffic-status/robot-insert', method: 'POST', config: QTrafficStatus.robotInsert },
  


  { path: '/setting-monitoring/get', method: 'POST', config: SettingMonitoring.get },
  { path: '/setting-monitoring/delete', method: 'POST', config: SettingMonitoring.delete },
  { path: '/get-history-input-media', method: 'POST', config: QTrafficMedia.getHistoryInput },
  { path: '/get-history-input-status', method: 'POST', config: QTrafficStatus.getHistoryOutput },
  { path: '/get-history-output-info', method: 'POST', config: QTrafficControlInfoRoute.getHistoryOutput },

];