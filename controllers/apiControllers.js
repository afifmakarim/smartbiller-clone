const axios = require("axios");
const { Biller_routing } = require("../models/biller_routing.model");
const { Biller_inquiry } = require("../models/biller_inquiry.model");
const CONFIG = require("../config");
const { nanoid } = require("nanoid");

const createMockData = async (req, res) => {
  try {
    const biller = await Biller_routing.create({
      biller_name: "XL Home",
      productId: "xl_home",
      pwd: "xl_home",
      inquiryUrl: "https://smartbiller-clone.free.beeceptor.com/api/biller/xl",
      confirmationUrl:
        "https://smartbiller-clone.free.beeceptor.com/api/biller/xl",
      checkStatusUrl:
        "https://smartbiller-clone.free.beeceptor.com/api/biller/xl",
      isActive: 1,
    });
    console.log("biller's auto-generated ID:", biller.id);
    res.status(200).send({ responseCode: "00", id: biller.id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const inquiryToBiller = async (req, res) => {
  try {
    const { acc_no, productId } = req.body;
    const biller = await Biller_routing.findOne({
      where: {
        productId: productId,
      },
    });

    if (!biller) {
      return res.status(404).send({ message: "biller productId not found." });
    }
    const postData = {
      acc_no: acc_no,
      productId: productId,
    };

    const resp = await axios.post(biller.inquiryUrl, postData, {
      timeout: CONFIG.TIMEOUT,
    });

    const data = {
      biller_name: biller.biller_name,
      sessionId: nanoid(12),
      productId: productId,
      amount: resp.data.amount || "-",
      notificationMessage: resp.data.message || "-",
      billReferenceNumber: resp.data.billReferenceNumber || "-",
      partner_response: JSON.stringify(resp.data),
    };

    const inquiryData = await Biller_inquiry.create(data);
    if (!inquiryData) {
      return res.status(404).send({ message: "failed to store inquiryData" });
    }
    const response = {
      responseCode: "00",
      message: "process request successfully",
      data: data,
    };

    res.status(200).send(response);
    console.log(response);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { createMockData, inquiryToBiller };
