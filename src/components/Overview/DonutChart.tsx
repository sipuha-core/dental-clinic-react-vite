import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { COLORS } from '../../utils/colors'

type Props = {
    data: { name: string, value: number }[]
}

const DonutChart = ({ data }: Props) => {
    return (
        <div className='w-36 h-36'>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={3}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DonutChart
