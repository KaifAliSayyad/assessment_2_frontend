import DashBar from '../../Components/DashBar';

export default function DisplayDashbar({budget, totalInvestment, currentValue, user}) {
    if(user){
        return(
            <DashBar
                budget={budget}
                totalInvestment={totalInvestment}
                currentValue={currentValue}
            />
        )
    }
}


