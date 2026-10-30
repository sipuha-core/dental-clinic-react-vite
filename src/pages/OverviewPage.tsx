import AppointmentsTable from "../components/Overview/AppointmentsTable"
import OverviewCard from "../components/Overview/OverviewCard"

const OverviewPage = () => {
    return (
        <div className="flex flex-col h-full w-full">
            <OverviewCard />
            <AppointmentsTable />
        </div>
    )
}

export default OverviewPage