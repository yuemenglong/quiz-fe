var React = require("react");

function ImageClass() {
    this.onError = function(e) {
        e.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADSUlEQVRoQ+1Z7W3bQAw9WrYAAxbVDZpMUHeC2hMknaDNBE0nSDJB3QnqTNB0gjgTJJ4g7gSxTgYM+IsFDUlQ5ZN0J0uwEvh+n3h8fLxHHgXilS945f6LI4BDM/i2GJBSngshvgkheiVH9hYRv6bZ9DzvEgB+aJw5AoAbx3FG4d6Igfl8frJcLp81jJhuGTuO0wOAqepDKSUD+2VitNVqnbbb7Ql/EwHwPO8aAK5MDGnszXR+Npt11+v1PQC807AVbSGiG9d1r1MBENHfRqORSrnuYc1mcxJGSvUNAyAiLec3m80QAN6zHR0AEUJdZ6veF8+QI4Ayox1c4jMhBKfSBABu4yoTnlU7Bjj3fd//rZJsIvruuu4gHqjaAfB9f0BEXHOUCwD6cSZqBSCI/ktOKv5BRC6s21UrAL7v94joPu8uIaKyTh1chXQAcC1yXfeklgwEKTEFADeDhf/6p1qlEDud1QMRkWfbdjdexSsFwC0BO9XpdJ7y8johjZdCCO7BIiY4dSzLOk/aqgwAd7GLxeKRHbMsq28KIlAkvtTdRqMxUhWxylSID5dScje5ZYCIprZtf8xq4EwYqryQSSm5kkZaHYB4QsR+Wv9fGwBZ7wciygXBqbdarb4IIR7S0qYyBnReUXkgpJT8LPwUOHmBiMMsdkq7xCavqCwQweVlEB/Y8WTvkwRTCoDg0j4bPgGHiHihim5gj1tolwUgS8X2BpBUHJPLCAA/Hcdhzd9ZzOhms9nKcBaIvQFIKXlyUOidnOxrFOnxErKaBmIvAAZzmzRiUi+pKjAMAhFP41JcGEAw7GK9L7RUrytVh5k0nhSAQgBMFCcFXepEzlSKjQEg4kBK+QgAUU9uSMEDIipHlDrvgfCskAkpJY8ft4M3rQeNEOIs7HEMHeftqRO5gqzeEdHYBAA/NrQmZorc9RDxRNULFawj2yP4YseUKnu0WCDi4SGeZVk9VUu9Tx1RBKkaAEKIz4h4pwqAqnPdI1CVADDS+qLOa11iU+NZrUIJRXDHnVwVMgSwl9YbnhXetd0UijdVBkYz5TJs0gzsaW1V/qHhL7k6EtEgZ14THlK21us4P+YpRlwo3tZfSp0Q1G3PkYFDM3Jk4NAM/AMv8YVeEQuiTQAAAABJRU5ErkJggg==";
    }
    this.render = function() {
        var props = this.props;
        return jade(`img({...props} onError={this.onError})`);
    }
}

module.exports = React.createClass(new ImageClass());
