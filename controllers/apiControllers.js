const axios = require("axios");
const { Biller_routing } = require("../models/biller_routing.model");
const { Biller_transaction } = require("../models/biller_transaction.model");
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
    const getBillerRouting = await Biller_routing.findOne({
      where: {
        productId: productId,
      },
    });

    if (!getBillerRouting) {
      return res.status(404).send({ message: "biller productId not found." });
    }

    if (getBillerRouting.isActive == 0) {
      return res
        .status(404)
        .send({ message: "biller productId is not active." });
    }

    const postData = {
      acc_no: acc_no,
      productId: productId,
      trx_type: "021",
    };

    const resp = await axios.post(getBillerRouting.inquiryUrl, postData, {
      timeout: CONFIG.TIMEOUT,
    });

    let inquiryStatus = "INQUIRY_SUCCESS";

    if (resp.data.responseCode !== "00") {
      inquiryStatus = "INQUIRY_FAILED";
      res.status(200).send({
        responseCode: "99",
        message: "Inquiry Failed",
        data: {
          responseCode: resp.data.responseCode,
          notificationMessage: resp.data.message,
        },
      });
    }

    const data = {
      biller_name: getBillerRouting.biller_name,
      sessionId: nanoid(12),
      productId: productId,
      amount: resp.data.amount || "-",
      notificationMessage: resp.data.message || "-",
      billReferenceNumber: resp.data.billReferenceNumber || "-",
      inquiryOriginalResponse: JSON.stringify(resp.data),
      inquiryStatus: inquiryStatus,
    };

    const inquiryData = await Biller_transaction.create(data);

    if (!inquiryData) {
      return res.status(404).send({ message: "failed to store inquiryData" });
    }

    const response = {
      responseCode: "00",
      message: "inquiry request successfully",
      data: {
        sessionId: data.sessionId,
        biller_name: data.biller_name,
        productId: productId,
        amount: data.amount,
        billReferenceNumber: data.billReferenceNumber,
        notificationMessage: data.notificationMessage,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

const confirmationToBiller = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(404).send({ message: "sessionId not found." });
    }

    const biller_transaction = await Biller_transaction.findOne({
      where: {
        sessionId: sessionId,
      },
    });

    const biller_routing = await Biller_routing.findOne({
      where: {
        productId: biller_transaction.productId,
      },
    });

    if (!biller_transaction) {
      return res.status(404).send({ message: "biller sessionId not found." });
    }

    const postData = {
      sessionId: sessionId,
      trx_type: "022",
    };

    const resp = await axios.post(biller_routing.confirmationUrl, postData, {
      timeout: CONFIG.TIMEOUT,
    });

    let paymentStatus = "PAYMENT_SUCCESS";
    if (resp.data.responseCode !== "00") {
      paymentStatus = "PAYMENT_FAILED";
      res.status(500).send({
        responseCode: "99",
        message: "Payment Failed",
        data: {
          responseCode: resp.data.responseCode,
          notificationMessage: resp.data.message,
        },
      });
    }

    const data = {
      notificationMessage: resp.data.message || "-",
      transactionId: resp.data.transactionId || "-",
      paymentOriginalResponse: JSON.stringify(resp.data),
      paymentStatus: paymentStatus,
    };

    const confirmationData = await Biller_transaction.update(data, {
      where: {
        sessionId: sessionId,
      },
    });

    if (!confirmationData) {
      return res
        .status(404)
        .send({ message: "failed to store confirmationData" });
    }

    if (biller_transaction.paymentStatus !== null) {
      return res.status(200).send({ message: "transaction already process" });
    }

    const response = {
      responseCode: "00",
      message: "Payment request successfully",
      data: {
        paymentStatus: data.paymentStatus,
        transactionId: data.transactionId,
        notificationMessage: data.notificationMessage,
      },
    };

    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createMockData, inquiryToBiller, confirmationToBiller };
