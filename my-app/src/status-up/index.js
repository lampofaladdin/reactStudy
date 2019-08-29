import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
        return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
}

function BoilingVerdict(props) {
    if (props.celsius >= 100) {
        return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
}

class TemperatureInput extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const temperature = this.props.temperature;
        const scale = this.props.scale;
        return (
            <fieldset>
                <legend>Enter temperature in {scaleNames[scale]}:</legend>
                <input
                    value={temperature}
                    onChange={(e) => { this.props.temperatureInputOnchange(e.target.value) }}
                />
            </fieldset>

        )
    }
}

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature: ""
        }
    }

    handleOnchange(val) {
        this.setState({
            temperature: val
        })
    }

    render() {
        const temperature = this.state.temperature;
        return (
            <div>
                <TemperatureInput scale="c"
                    temperature={temperature}
                    temperatureInputOnchange={this.handleOnchange.bind(this)} />
                <TemperatureInput scale="f"
                    temperature={temperature}
                    temperatureInputOnchange={this.handleOnchange.bind(this)} />
            </div>
        )
    }
}


//==============================

ReactDom.render(
    <Calculator />,
    document.getElementById('root')
);

