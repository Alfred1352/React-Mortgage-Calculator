import React from 'react';

export default class App extends React.Component {
  // your Javascript goes here
  constructor(props) {
    super(props);
    this.state = {
      balance: undefined,
      rate: undefined,
      term: 15,
      payment: 0,
      schedule: [],
      totalInterest: 0
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculateMortgagePayment = this.calculateMortgagePayment.bind(this);
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  calculateMortgagePayment(e) {
    e.preventDefault();
    const { balance, rate, term } = this.state;
    const r = rate / 1200;
    const n = term * 12;
    const payment = (balance * r) / (1 - (1 + r) ** -n);
    const schedule = [];

    let principal = balance;
    let totalInterest = 0;

    for (let i = 0; i < n; i++) {
      const interest = principal * r;
      const monthlyPrincipal = payment - interest;
      principal -= monthlyPrincipal;
      totalInterest += interest;

      schedule.push({
        month: i + 1,
        payment: payment.toFixed(2),
        principal: monthlyPrincipal.toFixed(2),
        interest: interest.toFixed(2),
        balance: principal.toFixed(2)
      });
    }

    this.setState({
      payment: payment.toFixed(2),
      schedule: schedule,
      totalInterest: totalInterest.toFixed(2)
    });
    
  }

  render() {
    const { schedule } = this.state;
    const monthlyPayment = this.state.payment;
    const scheduleRows = schedule && schedule.map((row) => (
      <tr key={row.month}>
        <td>{row.month}</td>
        <td>{parseFloat(row.payment).toLocaleString()}</td>
        <td>{parseFloat(row.principal).toLocaleString()}</td>
        <td>{parseFloat(row.interest).toLocaleString()}</td>
        <td>{parseFloat(row.balance).toLocaleString()}</td>
      </tr>
    ));

    return (
      <div className='container'>
      <h3>Mortgage Calculator</h3>
      <form className='form-horizontal'>
        <div className='form-group'>
          <label className='col-sm-3 control-label'>Mortgage Loan Balance (USD):</label>
          <div className='col-sm-9'>
            <input type='number' name='balance' value={this.state.balance} onChange={this.handleInputChange} className='form-control' required />
          </div>
        </div>
        <div className='form-group'>
          <label className='col-sm-3 control-label'>Annual Percentage Rate (APR):</label>
          <div className='col-sm-9'>
            <input type='number' name='rate' step='0.01' value={this.state.rate} onChange={this.handleInputChange} className='form-control' />
          </div>
        </div>
        <div className='form-group'>
          <label className='col-sm-3 control-label'>Select Loan Term:</label>
          <div className='col-sm-9'>
            <select name='term' value={this.state.term} onChange={this.handleInputChange} className='form-control' required >
              <option value='15'>15 Years</option>
              <option value='30'>30 Years</option>
            </select>
          </div>
        </div>
        <div className='form-group'>
          <div className='col-sm-offset-3 col-sm-9'>
            <button name='submit' onClick={(e) => this.calculateMortgagePayment(e)} className='btn btn-primary'>Calculate Your Monthly Payment!</button>
          </div>
        </div>
      </form>
      <div id='output' name='output'>Monthly Payment: {monthlyPayment}</div>
      <table className='table'>
        <thead>
          <tr>
            <th>Month</th>
            <th>Payment</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Balance</th>
          </tr>
        </thead> 
        <tbody>
          {scheduleRows}
        </tbody>
      </table>
      <div>Total Interest: ${this.state.totalInterest}</div>
    </div>
    );
  }
}
