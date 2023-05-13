let Orders = require('../../model/orders_model')
const helper = require("../../utils/helper");
const APIResp = require("../../utils/APIResp");
const moment = require('moment')

const ordersController = () => {

    const createOrders = async (req, res) => {
        try {
            const userInput = helper.getReqValues(req);
            let orders = await Orders.find({ order_id: userInput.order_id })
            if (orders.length != 0) {
                return APIResp.getErrorResult(`order id - ${userInput.order_id} is already present`, res)
            }

            let data = await Orders.create({
                order_id: userInput.order_id,
                item_name: userInput.item_name,
                cost: userInput.cost,
                order_date: moment(userInput.order_date).format(),
                delivery_date: moment(userInput.delivery_date).format()
            });
            data.save();
            APIResp.getSuccessResult(data, "orders inserted successfully", res);


        }
        catch (err) {
            console.log(err)
            APIResp.getINTERNALSERVERError(err, res);
        }
    }
    const updateOrders = async (req, res) => {
        try {
            const userInput = helper.getReqValues(req);

            let orders = await Orders.find({ order_id: JSON.parse(userInput.order_id) })
            if (orders.length == 0) {
                return APIResp.getErrorResult(`order id - ${JSON.parse(userInput.order_id)} is not present`, res)
            }

            let data = await Orders.updateMany({ order_id: JSON.parse(userInput.order_id) }, {
                $set: {
                    item_name: userInput.item_name,
                    cost: userInput.cost,
                    order_date: userInput.order_date,
                    delivery_date: userInput.delivery_date
                }
            })
            APIResp.getSuccessResult(data,
                `order id - ${JSON.parse(userInput.order_id)} updated successfully`, res);

        }
        catch (err) {
            console.log(err)
            APIResp.getINTERNALSERVERError(err, res);
        }

    }

    const listOrders = async (req, res) => {
        try {
            const userInput = helper.getReqValues(req);

            let inputdate = JSON.parse(userInput.order_date)
            // console.log(userInput,)
            let data = await Orders.find({ order_date: moment(inputdate).format() })
            APIResp.getSuccessResult(data,
                `listed successfully based on order_date`, res);
        }
        catch (err) {
            console.log(err)
            APIResp.getINTERNALSERVERError(err, res);
        }
    }

    const listDelivery = async (req, res) => {
        try {
            const userInput = helper.getReqValues(req);

            let inputdate = JSON.parse(userInput.delivery_date)

            let data = await Orders.find({ delivery_date: moment(inputdate).format() })
            APIResp.getSuccessResult(data,
                `listed successfully based on delivery_date`, res);
        }
        catch (err) {
            console.log(err)
            APIResp.getINTERNALSERVERError(err, res);
        }
    }


    const search = async (req, res) => {
        try {
            const userInput = helper.getReqValues(req);

            let data = await Orders.find({ order_id: JSON.parse(userInput.order_id) })
            APIResp.getSuccessResult(data,
                `records displayed based on order id - ${JSON.parse(userInput.order_id)}`, res);
        }
        catch (err) {
            console.log(err)
            APIResp.getINTERNALSERVERError(err, res);
        }
    }
    const deleteOrders = async (req, res) => {
        try {
            const userInput = helper.getReqValues(req);
            let inputorder = JSON.parse(userInput.order_id)

            let orders = await Orders.find({ order_id: inputorder })
            if (orders.length == 0) {
                return APIResp.getErrorResult(`order id - ${inputorder} is not present`, res)
            }

            let data = await Orders.deleteMany({ order_id: inputorder })
            APIResp.getSuccessResult(data,
                `records deleted based on order id - ${inputorder}`, res);

        }
        catch (err) {
            console.log(err)
            APIResp.getINTERNALSERVERError(err, res);
        }
    }

    return {
        createOrders,
        updateOrders,
        listOrders,
        listDelivery,
        search,
        deleteOrders
    };
};
module.exports = ordersController();
