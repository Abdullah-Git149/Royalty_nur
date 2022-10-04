var FCM = require("fcm-node");
var serverKey = "AAAAVvueMlI:APA91bFzozpw3DrJHWF86vdjf04dxuW6RmayghG2xFUccL13tHkndb2q0sXW5nN3uY0BbTqPOlMqq3BGgv5VBAWIOqiSvrPyo7bPfR_TC5o3wQOkytuuVoPjGj4XaKT804RPZ66I2yXd"; //put your server key here
var fcm = new FCM(serverKey);

const push_notifications = (notification_obj) => {
    console.log(notification_obj)
  var message = {
    to: notification_obj.user_device_token,
    collapse_key: "your_collapse_key",

    notification: {
      user_id: notification_obj.user_id,
      hospital_id: notification_obj.hospital_id,
      full_name: notification_obj.full_name,
      user_Image: notification_obj.user_Image,
      title: notification_obj.title,
      body: notification_obj.body,
      notification_type: notification_obj.notification_type,
      //   type: notification_obj.type
    },

    data: {
      //you can send only notification or only data(or include both)
      //   sender_object: notification_obj.sender_objects,
      //   receiver_object: notification_obj.receiver_objects,
      user_id: notification_obj.user_id,
      hospital_id: notification_obj.hospital_id,
      full_name: notification_obj.full_name,
      user_Image: notification_obj.user_Image,
      notification_type: notification_obj.notification_type,
      //   sender_object: JSON.parse(notification_obj.sender_objects),
      //   receiver_object: JSON.parse(notification_obj.receiver_objects)
    },
  };
   fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};

module.exports = { push_notifications };
