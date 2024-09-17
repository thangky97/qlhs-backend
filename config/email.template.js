module.exports = {
  verify_email: {
    subject: "Verify Email",
    html: `<p>Hello,</p>      
        <p>You registered an account on JTS-SERVICE, before being able to use your account you need to verify that this is your email address by clicking here: 
        <a href="{{href}}">[link]</a></p>
        <p>Kind Regards, JTS company<p/>`,
  },
  forgot_password: {
    subject: "Forgot Password",
    html: `<p>Hello,</p>      
        <p>Please click here to reset password: 
        <a href="{{href}}">[link]</a></p>
        <p>Kind Regards, JTS company<p/>`,
  },
  report_error: {
    subject: "Report Error",
    html: `<p>Report an error at intersection: {{intersection_id}}</p>
        <p>Error description: {{description}}</p>
        <a href="{{file_url}}">Click here to view file describe error.</a>
        `,
  },
  contact: {
    subject: "Contact",
    html: `
            <div>Full name: {{fullname}}</div><br/>
            <div>Phone: {{phone}} </div><br/>
            <a href="mailto: {{email}}"> {{email}} </a><br/>
            <div>Content: {{message}} </div><br/>
            <div>Company: {{company}} </div><br/>
         `,
  },
  sendpaycloud: {
    subject: "Contact",
    html: `
            <div>Full name: {{fullname}}</div><br/>
            <a href="mailto: {{email}}"> {{email}} </a><br/>
            <div>Cloud: {{cloud}} </div><br/>
            <div>Package: {{package}} </div><br/>
            <div>Token: {{token}} </div><br/>
            <div>Price: {{price}} </div><br/>
            <div>Duration: {{duration}} </div><br/>
         `,
  },
  notification: {
    subject: "Thông báo",
    html: `
    <div>Dear Mr/Ms.<strong> {{username}} </strong>,</div><br/> <div>Cảm ơn quý khách hàng đã đăng ký sản phẩm dịch vụ của V-Quantum. Chúng tôi xác nhận đơn hàng đã được thanh toán thành công.</div><br/> <div>Thank you for registering V-Quantum's products and services. We confirm the order has been successfully paid.</div><br/> <div>この度は、V-Quantumの製品・サービスをご登録いただき、誠にありがとうございます。ご注文が正常に決済されたことを確認しました。</div><br/> <div>Mã token của quý khách là “<strong> {{token}} </strong>”</div><br/> <div>Your token is “<strong> {{token}} </strong>”</div><br/> <div>トークンは "<strong> {{token}} </strong>" です。</div><br/> <div>Vui long sử dụng mã token trên trong quá trình học để thực hành V-Quantum</div><br/> <div>Please use the above token during the learning process to practice V-Quantum</div><br/> <div>V-Quantumを実践するための学習過程で、上記トークンをご利用ください</div><br/> <div>Thân !</div><br/> <div>Best regards !</div><br/> <div>V-Quantum team</div><br/> 
        
         `,
  },
  cloudContact: {
    subject: "Cloud Contact",
    html: `
            <div>Title: {{title}} </div><br/>
            <div>Full name: {{userId}}</div><br/>
            <a href="mailto: {{email}}"> {{email}} </a><br/>
            <div>Content: {{message}} </div><br/>
         `,
  },
  sendTokenOrderInformation: {
    subject: "sendTokenOrderInformation",
    html: `
            <div>ID ORDER: {{idOrder}}</div><br/>
            <div>Full name: {{fullName}} </div><br/>
            <a href="mailto: {{email}}"> {{email}} </a><br/> 
            <div>Phone: {{phone}} </div><br/> 
            <div>Address: {{address}} </div><br/>
            <div>Total Money: {{totalMoney}} </div><br/>
            <div>Payment Methods: {{paymentMethods}} </div><br/>
            <div>Date create: {{date}} </div><br/>
            <div>Note: {{note}} </div><br/>
         `,
  },
};
