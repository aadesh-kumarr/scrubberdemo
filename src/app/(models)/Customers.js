import mongoose ,{Schema} from "mongoose";
import { type } from "os";

mongoose.connect(process.env.mongodb_url)
mongoose.Promise=global.Promise

// Define the schema
const newcustformSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  balanceAmount: { type: Number, required: true },
  creation_date:{type: Date, required:true},

});

// Ensure the model is not redefined
const Customers = mongoose.models.Customers || mongoose.model('Customers', newcustformSchema);

export default Customers;


const orderSchema= new Schema({
  customer_id:{ type: String, required: true },
  date:{type: Date, required:true},
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amountReceived: { type: Number, required: true }, 
  balanceAmount:{ type: Number, required: true }, //of that particular order 
  category:{ type: String, required: true },       //ss?gi
  unit: { type: String, required: true },          //cartoon?pack
  size :{ type: Number, required: true },          //6 or 12
  total: { type: Number, required: true },         //order total 
  last_balance: { type: Number, required: true },  //balance of customer at time off order to be added in order display card 
  
  



});

const Orders =mongoose.models.Orders || mongoose.model("Orders",orderSchema);
export {Orders};



const paymentSchema=new Schema({
  customer_id:{ type: String, required: true },
  date:{type: Date, required:true},
  payment:{type:Number,required:true}
})

const Payment=mongoose.models.Payment || mongoose.model('Payment',paymentSchema)
export {Payment};