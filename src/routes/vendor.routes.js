const express=require("express")
const router=express.Router()


const {signup, verifyEmail}=require("@vendor/Onboarding/Registration/Signup.module.js")
const {login}=require("@vendor/Onboarding/Registration/Login.module.js")
const {forgotPassword,validateResetToken}=require("@vendor/Onboarding/Password/forget.module.js")
const {checkController}=require("@vendor/Onboarding/Registration/Check.module.js")
const {updatePassword}=require("@vendor/Onboarding/Password/update.module.js")
const {addVenue}=require("@vendor/Onboarding/Venue/addVenue.module.js")
const {getVenues}=require("@vendor/Onboarding/Venue/getVenue.module.js")
const {submitEmail}=require("@vendor/Onboarding/Contact/Contact.module.js")






const authenticateToken=require("@middlewares/auth.middleware.js")







router.post('/venue/register',submitEmail)


router.post('/auth/register',signup)
router.get('/auth/verify-email/:token', verifyEmail); //use to generate verification link (webhook)
router.post('/auth/login', login);
router.post('/forget/password', forgotPassword);
router.get('/forget/reset-password/:token', validateResetToken); // use to generate verification link for password (webhook)
router.post('/reset-password', updatePassword);
router.post('/addvenue',authenticateToken, addVenue);
router.get('/getvenues',authenticateToken, getVenues);
router.post('/check/verify', checkController);






//Payment
const {createPayment,GetPayment}=require("@vendor/Payment/createPayment.module.js")
const {Checkpayment,PaymentSuccess,PaymentFailed}=require("@vendor/Payment/example.js")
router.post('/payment/create',authenticateToken, createPayment);
router.get('/payment',authenticateToken, GetPayment);
router.post('/payment-create',authenticateToken, Checkpayment);
router.get('/payment-success', PaymentSuccess);
router.get('/payment-failed', PaymentFailed);










//Billing and Coupon
const {createBillingInfo}=require("@vendor/Onboarding/Billing/billing.module.js")
const { createCoupon,validateCoupon }=require("@vendor/Onboarding/Billing/coupon.module.js")

router.post('/billing-create',authenticateToken, createBillingInfo);
router.post('/coupon-create', createCoupon);
router.post('/coupon-validate',authenticateToken, validateCoupon);


module.exports=router