/****************************
 Developed by : Shiva Software Solutions
 File    : constants
 Date    : 30-08-2022
 Purpose : constants variable 
 * ********************** */

module.exports = { 
  //Server Response
  defaultServerResponse: {
    status: 400,
    message: '',
    body: {}
  },
  //Database Connections
  connectionString: 'postgresql://postgres:Gudmedrds$123@gudmed-rds-test.cmogvoenzszz.ap-south-1.rds.amazonaws.com/gudmedtest',
  // API MESSAGE
  success_message:{
    LISTED_SUCCESS: 'listed successfully',
    CREATED_SUCCESS: 'created successfully',
    UPDATED_SUCCESS: 'updated successfully',
    DELETED_SUCCESS: 'deleted successfully',
    RESET_SUCCESS:'Reset successfully',
    CHANGE_PASWD:'Password changed successfully',
    CANCELED_SUCCESSS:'canceled successfully',
    SAVED_SUCCESS: 'saved successfully'
  } ,
  //STATUS
  statuscode:{
    ACTIVE:1,
    INACTIVE: 2,
    DELETE: 3,
  },

  //User Management
  userMessage: {
    SIGNUP_SUCCESS: 'Signup Success',
    USER_CREATED: 'Saved Successfully',
    USER_DELETED:'Deleted Successfully',
    USER_IN_USE:'User already in use',
    USER_UPDATED:'Updated Successfully',
    RESET_PASWD: 'Password reset successfully',
    CHANGE_PASWD:'Password changed successfully',
    LOGIN_SUCCESS: 'Login Success',
    DUPLICATE_EMAIL: 'Email already exist',
    DUPLICATION_USER:'User already exist',
    DUPLICATION_AGENT:'Agent ID already exist',
    USER_NOT_FOUND: 'User not found',
    USER_BLOCKED: 'User is blocked',
    USER_ALREADY_USE: 'This user cannot be deleted as this user has performed some actions in the CRM portal.',
    INVALID_PASSWORD: 'Incorrect User ID or Password',
    OLD_PASSWORD_INCORRECT: 'Old Password is incorrect',
    USERS_FETCHED: 'Users Fetched Successfully',
   
    ONLINE_OFFLINE_STATUS:'User Online/Offline',
    OTP_ERROR:'This Agent ID is not registered with us',
    OTPINVALID:'Invalid OTP',
    OTPEXPIRED:'Your OTP is expired , Please try again!',
    SESSION_LOG:'Insert Active Session',
    SYSTEMIP:'check system ip address',
    CHANGEMOBILE:'Mobile No. has been changed successfully',
    MACHINE_DUPLICATION: 'Machine No. already exist',
    DESIGN_DUPLICATION: 'Design No. already exist',
    DEPARTMENT_DUPLICATE: 'Department already exist',
    ITEMGROUP_DUPLICATION: 'Itemgroup already exist',
    SHORTNAME_DUPLICATION: 'Shortname already exist',
    CUSTOMER_DUPLICATION: 'Customer already exist',
    ITEM_DUPLICATION: 'Item already exist',
    COLOR_DUPLICATION: 'Color already exist',
    DESIGNATION_DUPLICATION: 'Designation already exist',
    USER_EXISTS: 'User already exist',
    EMPLOYEE_EXISTS: 'Employee Name already exists',
    EMPLOYEE_DELETE: 'Salary process,salary payout pending for the employee',
    EMPLOYEECODE_EXISTS: 'Employee code already exists',
    UPLOAD_IMAGE: 'Image upload sucessfully',
    ALREADY_EXITS : 'Already in use',
    CUSTOMEREXIT:"This customer already use",
    INACTIVE_USER:'User inactive',
    UNAUTHORISED:'You are not authorized to login',
    USER_NAME_CHECK:'Username already in use',
    DEVICE_NAME_CHECK:'Devices ID already in use',
    BOTH_NAME_CHECK:'Username or Devices ID already in use',
    CUSTOMER_ALREADY_USED: 'Customer already in used',
    GSTIN_ALREADY_USED: 'Gstin already exists',
    ALREADY_USE : 'Already use',
    SOMETHING_WRONG: 'Data is missing',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    TOKEN_MISSING:'Token not found',
    IRONMACHINENO_DUPLICATE: 'Iron machine no. already exist',
    CANCEL_SUCCESS: 'Cancelled Successfully',
    CANCEL_FAILED: 'Unable to Cancel',
    ALREADY_SYNC : 'Already synced',
    ORDER_HOLD:'Order hold Successfully',
    ORDER_UNHOLD:'Order unhold Successfully',
    ORDER_STATUS: '1,3',
    CUSTOMER_BLOCKED:'Customer Blocked Successfully',
    ITEMSUBGROUP_DUPLICATION: 'Item sub category already exist for this item category',
  },
  //login message 
  loginmessage:{
   LOGIN_SUCCESS:'Login Successfully',
   USER_INACTIVE:'User inactive',
   USERPASSWORD_INCORRECT:'username or password is incorrect',
   USER_NOT_FOUND:'User not found'
  },
  // FG Message
  FGMessage:{
    ERRORINDELETE: 'Fg Already in used',
    ERRORINEDIT: 'Fg Already in used'
  },

  customerStatus: {
    active: 1,
    inActive: 2,
    cancel: 8
  },
  DispatchMessage:{
    DELETESUCCESS: 'Dispatch item deleted successfully'
  },
  GoodsReturnMessage:{
    LISTSUCCESS: 'Listed Successfully'
  },
}

