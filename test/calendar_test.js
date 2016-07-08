import React from 'react'
import moment from 'moment'
import Calendar from '../src/calendar'
import YearDropdown from '../src/year_dropdown'
import { shallow } from 'enzyme'

describe('Calendar', function () {
  var dateFormat = 'MMMM YYYY'

  function getCalendar (extraProps) { // eslint-disable-line react/display-name
    return shallow(<Calendar
        dateFormat={dateFormat}
        onSelect={() => {}}
        onClickOutside={() => {}}
        hideCalendar={() => {}}
        {...extraProps} />)
  }

  it('should start with the current date in view if no date range', function () {
    var now = moment()
    var calendar = getCalendar()
    assert(calendar.state().date.isSame(now, 'day'))
  })

  it('should start with the selected date in view if provided', function () {
    var selected = moment().add(1, 'year')
    var calendar = getCalendar({ selected })
    assert(calendar.state().date.isSame(selected, 'day'))
  })

  it('should start with the current date in view if in date range', function () {
    var now = moment()
    var minDate = now.clone().subtract(1, 'year')
    var maxDate = now.clone().add(1, 'year')
    var calendar = getCalendar({ minDate, maxDate })
    assert(calendar.state().date.isSame(now, 'day'))
  })

  it('should start with the min date in view if after the current date', function () {
    var minDate = moment().add(1, 'year')
    var calendar = getCalendar({ minDate })
    assert(calendar.state().date.isSame(minDate, 'day'))
  })

  it('should start with the min include date in view if after the current date', function () {
    var minDate = moment().add(1, 'year')
    var calendar = getCalendar({ includeDates: [minDate] })
    assert(calendar.state().date.isSame(minDate, 'day'))
  })

  it('should start with the max date in view if before the current date', function () {
    var maxDate = moment().subtract(1, 'year')
    var calendar = getCalendar({ maxDate })
    assert(calendar.state().date.isSame(maxDate, 'day'))
  })

  it('should start with the max include date in view if before the current date', function () {
    var maxDate = moment().subtract(1, 'year')
    var calendar = getCalendar({ includeDates: [maxDate] })
    assert(calendar.state().date.isSame(maxDate, 'day'))
  })

  it('should start with the open to date in view if given and no selected/min/max dates given', function () {
    var openToDate = moment('09/28/1993')
    var calendar = getCalendar({ openToDate })
    assert(calendar.state().date.isSame(openToDate, 'day'))
  })

  it('should not show the year dropdown menu by default', function () {
    var calendar = getCalendar()
    var yearReadView = calendar.find(YearDropdown)
    expect(yearReadView).to.have.length(0)
  })

  it('should show the year dropdown menu if toggled on', function () {
    var calendar = getCalendar({ showYearDropdown: true })
    var yearReadView = calendar.find(YearDropdown)
    expect(yearReadView).to.have.length(1)
  })

  it('should not show the today button by default', function () {
    var calendar = getCalendar()
    var todayButton = calendar.find('.react-datepicker__today-button')
    expect(todayButton).to.have.length(0)
  })

  it('should show the today button if toggled on', function () {
    var calendar = getCalendar({ todayButton: 'Vandaag' })
    var todayButton = calendar.find('.react-datepicker__today-button')
    expect(todayButton).to.have.length(1)
    expect(todayButton.text()).to.equal('Vandaag')
  })

  describe('localization', function () {
    function testLocale (calendar, selected, locale) {
      var localized = selected.clone().locale(locale)

      var calendarText = calendar.find('.react-datepicker__current-month')
      expect(calendarText.text()).to.equal(localized.format(dateFormat))

      var firstDateOfWeek = localized.clone().startOf('week')
      var firstWeekDayMin = firstDateOfWeek.localeData().weekdaysMin(firstDateOfWeek)
      var firstHeader = calendar.find('.react-datepicker__day-name').at(0)
      expect(firstHeader.text()).to.equal(firstWeekDayMin)
    }

    it('should use the globally-defined locale by default', function () {
      var selected = moment()
      var calendar = getCalendar({ selected })
      testLocale(calendar, selected, moment.locale())
    })

    it('should use the locale specified as a prop', function () {
      var locale = 'fr'
      var selected = moment().locale(locale)
      var calendar = getCalendar({ selected, locale })
      testLocale(calendar, selected, locale)
    })

    it('should override the locale of the date with the globally-defined locale', function () {
      var selected = moment().locale('fr')
      var calendar = getCalendar({ selected })
      testLocale(calendar, selected, moment.locale())
    })

    it('should override the locale of the date with the locale prop', function () {
      var locale = 'fr'
      var selected = moment()
      var calendar = getCalendar({ selected, locale })
      testLocale(calendar, selected, locale)
    })
  })
})
