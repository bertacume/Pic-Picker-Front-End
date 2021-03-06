import React from 'react'
import { View} from 'react-native'
import { BarChart} from 'react-native-svg-charts'
import { Text } from 'react-native-svg'

class ColumnChartComponent extends React.Component {
    render() {
        const data = this.props.feedbackAge.map(x => {
            return  Math.round(x.summary*100)
        }
        )
        const CUT_OFF = Math.max(data);
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                (value>0) && <Text style={{color: "#fff"}}
                    key={ index }
                    x={ x(index) + (bandwidth / 2) }
                    y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
                    fontSize={ 14 }
                    fill={ value >= CUT_OFF ? 'white' : 'black' }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                >
                    {value}
                </Text>
            ))
        )
        return (
             <View style={{ flexDirection: 'row', height: 125 }}>
                <BarChart
                    style={{ flex: 1 }}
                    data={data}
                    svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                >
                <Labels/>
                </BarChart>
            </View>
        )
    }
}

export default ColumnChartComponent