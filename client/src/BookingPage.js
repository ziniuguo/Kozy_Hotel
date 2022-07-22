import React from "react";
import {Controller, useForm} from "react-hook-form";
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { emphasize } from "@mui/material";


const Styles = styled.div`

  h1 {
    color: #3d3d3d;
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
    margin-bottom: 10px;
  }


  form {
    border:1px solid #ffffff;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 auto;
    max-width: 700px;
    padding: 30px 40px;
  }

  #checkin, #checkout, #guestNum, #destID, #hotelID{
    display: none;
  }



  input {
    border: 2px solid #737373;
    border-radius: 7px;
    padding: 7px;
    width: 100%;
  }

  select {
    border: 2px solid #737373;
    border-radius: 7px;
    padding: 6px;
    width: 98%;
  }

  label {
    color: #3d3d3d;
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .error {
    color: red;
    font-size: 12px;
    height: 10px;
    display: flex;

  }

  .submitButton {
    background-color: #6976d9;
    color: white;
    font-size: 16px;
    font-weight: 500;
    margin: 20px 0px;

`;


export default function BookingPage() {

    const { control, register, formState: { errors }, handleSubmit, reset } = useForm();

    function Error({ errors }) {
      return  <div className={"error"}>{errors ? errors.message : " "}</div>;
    }

    const destID = sessionStorage.getItem("destID");
    const hotelID = sessionStorage.getItem("hotelID")
    const displayCheckin = sessionStorage.getItem("displayCheckin");
    const checkinDate = sessionStorage.getItem("checkinDate");
    const displayCheckout = sessionStorage.getItem("displayCheckout")
    const checkoutDate = sessionStorage.getItem("checkoutDate");
    const guests = sessionStorage.getItem("guestCount");


    const onSubmit = async (data) => {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
        const response = await fetch('/booking', requestOptions)
        .catch((error) => {
          console.log(error)
        });
        console.log("POST done!")
        const jsonData = await response.json();
        console.log(jsonData);

        alert("Booking confirmed! Enjoy your trip!");
        reset();
    }

    return (
      <Styles>

        <br/><h1>Hotel booking form</h1>

          <div>
            <form id="bookingForm" onSubmit={handleSubmit(onSubmit)}>
            
            <div>
              <input id="destID" type="text" value={destID} {...register("destinationID")} readOnly/>
              <input id="hotelID" type="text" value={hotelID} {...register("hotelID")} readOnly/>
            </div>

            <table id="dispTable">
                <tbody>
                  <tr>
                    <td>
                      <label>Check-In date:</label>
                      <div>&nbsp;<b>{displayCheckin}</b></div>
                      <input id="checkin" type="text" value={checkinDate} {...register("checkinDate")} readOnly/>
                    </td>

                    <td>
                      <label>Check-Out date:</label>
                      <div>&nbsp;<b>{displayCheckout}</b></div>
                      <input id="checkout" type="text" value={checkoutDate} {...register("checkoutDate")} readOnly/>
                    </td>

                    <td>
                      <label>Number of guests: &nbsp;<b>{guests}</b></label>
                      <input id="guestNum" type="text" value={guests} {...register("guests")} readOnly/>
                    </td>

                  </tr>
                </tbody>
              </table><br/>

              
          

            <table>
              <tbody>
                <tr>
                  <td>
                  <div>
                      <label>Salutation: &nbsp;</label>
                      <select id="salutation" {...register("salutation", { required: "Salutation is required." })}>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                        <option value="Sir">Sir</option>
                        <option value="Madam">Madam</option>
                        <option value="-">-</option>
                      </select>
                      <Error errors={errors.salutation} />
                    </div><br/>
                  </td>
                  <td>
                    <div>
                      <label>First name: &nbsp;</label>
                      <input type="text" id="firstname" size="20" {...register("firstName", {
                        required: "First name is required!", 
                        maxLength: 100}
                        
                        )} />
                      <Error errors={errors.firstName} />
                    </div><br/>
                  </td>

                  <td>
                    <div>
                      <label>Last name: &nbsp;</label>
                      <input type="text" id="lastname" size="20" {...register("lastName", {
                        required: "Last name is required!", 
                        maxLength: 100}
                        
                        )} />
                      <Error errors={errors.lastName} />
                    </div><br/>
                  </td>
                </tr>
              </tbody>
            </table>

            <table>
              <tbody>
                <tr>
                    <td>
                      <div>
                        <label>Phone number: &nbsp;</label>
                        <input type="text" id="phonenum" size="14" {...register("phoneNumber", {
                          required: "Phone number is required",
                          pattern: {value: /^[0-9]+$/i, message: "Invalid phone number!"}}
                          
                          )} />
                        <Error errors={errors.phoneNumber} />
                      </div><br/>
                    </td>

                    <td>
                      <div>
                        <label>Email address: &nbsp;</label>
                        <input type="text" id="email" size="26" {...register("emailAddress", {
                          required: "Email address is required", 
                          pattern: {value: /^\S+@\S+$/i, message: "Invalid email address!"}}
                          
                          )} />
                        <Error errors={errors.emailAddress} />
                      </div><br/>
                    </td>
                  </tr>
              </tbody>
            </table>

            





            <div>
              <label>Special requests (if any):  &nbsp;</label>
              <input type="textarea" id="sprequests" size="40" {...register("specialRequests", {
                required: false}
                
                )} />
              <Error errors={errors.specialRequests} />
            </div><br/>
            
            <div>
            <label>Credit card number: &nbsp;</label>
              <input type="text" id="creditcardNo" size="20" placeholder="**** **** **** ****" {...register("creditCardNumber", {
                required: "Credit card number is required", 
                minLength:16, 
                maxLength: 16, 
                pattern: {value: /^[0-9]+$/i, message: "Invalid credit card number!"}}
                
                )} />
              <Error errors={errors.creditCardNumber} />
            </div><br/>

            <table>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <label>Credit card expiry date: &nbsp;</label>
                      <input type="text" id="cardexpiry" size="8" placeholder="MM/YYYY" {...register("cardExpiry", {
                        required: "Credit card expiry date is required", 
                        pattern: {value: /^(0[1-9]|1[0-2])\/\d{4}$/, message: "Invalid expiry date!"}}
                        
                        )} />
                      <Error errors={errors.cardExpiry} />
                    </div><br/>
                  </td>

                  <td>
                    <div>
                      <label>CVV/CVC: &nbsp;</label>
                      <input type="password" id="cvvcvc" size="8" placeholder="***" {...register("CVV_CVC", {
                        required: "CVV/CVC is required", 
                        pattern: {value: /^\d{3}$/, message: "Invalid CVV/CVC!"}}
                        
                        )} />
                      <Error errors={errors.CVV_CVC} />
                    </div><br/>
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <label>Billing address: &nbsp;</label>
              <input type="text" id="billing" size="40" {...register("billingAddress", 
              {required: "Billing address is required"}

                )} />
              <Error errors={errors.billingAddress} />
            </div><br/>

      
            <input type="submit" id="submitbooking" className="submitButton" value="Make Booking"/>
          </form>
        </div>
        <p> </p>
      </Styles>
    );

};