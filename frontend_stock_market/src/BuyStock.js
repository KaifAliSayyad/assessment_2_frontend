import axios from 'axios';

async function buyStock(stock, quantity, id) {
    try{
        const response = await axios.post(`http://localhost:9999/trading/buy/${id}`, {
            stockId : stock?.id,
            quantity : quantity
        });
        if(response.status === 200){
            alert("Stock bought successfully");
        }
    }
    catch(e){
        alert("Failed to buy stock");
        console.log(e);
    }
};

export default buyStock;