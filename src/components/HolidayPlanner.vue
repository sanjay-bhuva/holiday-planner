<template>
  <div class="holiday-planner-form">
    <h1>Holiday Planner</h1>
    <label>How long is your vacation?</label>
    <input v-model="numberOfLeaves" placeholder="Number of days" type="number" min="1" max="365" />
    <div class='button' @click="calculateBestDates">Calculate Best Dates</div>

    <div v-if="hasResults" class="results">
      <div v-for="(result, index) in results" :key="index" class="result-item">
        <p class="result-title">{{ result.from }} - {{ result.to }}</p>
        <span class="result-leave">{{ result.leaves }} days of annual leave</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import * as moment from 'moment';

@Component
export default class HolidayPlanner extends Vue {

  get hasResults(): boolean {
    return this.results.length > 0;
  }

  // remove duplicate entries from json file and sort desc
  get uniqSortedHolidays(): any[] {
    return this.holidays
      .filter((v, i, a) => a.findIndex((h) => (h.date === v.date)) === i)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // consider only upcoming holidays
  get upcomingHolidays(): any[] {
    return this.uniqSortedHolidays.filter((holiday) => this.dateToMoment(holiday.date).isAfter(moment()));
  }

  get upcomingHolidaysDates(): any[] {
    return this.upcomingHolidays.map((holiday) => holiday.date);
  }

  @Getter public holidays;
  public data() {
    return {
      numberOfLeaves: 2,
      displayDateFormat: 'ddd, DD MMM',
      dateFormat: 'YYYYMMDD',
      results: [],
    };
  }

  // convert moment to display format
  public momentToDisplayDate(date) {
    return date.format(this.displayDateFormat);
  }

  // convert moment to YYYYMMDD
  public momentToDate(date) {
    return parseInt(moment(date).format(this.dateFormat));
  }

  // convert YYYYMMDD to moment
  public dateToMoment(date) {
    return moment(date, this.dateFormat);
  }

  // iterate through each holidays starting from that
  // go upto number of leaves wanted by employee
  // check how many holidays OR weekends falling within
  // sort by min number of leave
  //
  public calculateBestDates(): any[] {
    const leaves = parseInt(this.numberOfLeaves);

    this.results = this.upcomingHolidays.slice().map((holiday) => {
      const startDate = this.dateToMoment(holiday.date);
      const endDate = startDate.clone().add(leaves - 1, 'days');
      const holidays = this.getHolidaysInBetween(startDate.clone(), endDate.clone());

      return {
        from: this.momentToDisplayDate(startDate),
        to: this.momentToDisplayDate(endDate),
        holidays,
        leaves: Math.abs(leaves - holidays),
      };
    }).filter((result) => result.holidays >= leaves).sort((a, b) => a.leaves - b.leaves);
  }

  // get number of sat/sun days between start and end dates
  // if not then check if it's a holiday
  // we are starting from value '1' as startDate is already a holiday
  //
  public getHolidaysInBetween(startDate, endDate) {
    let holidays = 1;
    const currDate = startDate;

    while (currDate.add(1, 'days').diff(endDate) <= 0) {
      const isWeekend = currDate.day() % 6 === 0;
      const isHoliday = this.upcomingHolidaysDates.includes(this.momentToDate(currDate));
      holidays += (isWeekend || isHoliday) ? 1 : 0;
    }

    return holidays;
  }
}
</script>

<style scoped lang="scss">
.holiday-planner-form {
  padding: 2rem;
  background-color: #FAFAFA;
  border-radius: 4px;

  h1 {
    text-align: center;
    margin-top: 0rem;
  }

  label {
    font-weight: 600;
  }

  input[type=number] {
    width: 100%;
    padding: 12px;
    margin: 12px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .button {
    text-align: center;
    background-color: #46b4e5;
    color: white;
    margin: 12px 0;
    padding: 14px 20px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  }

  .results {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    margin-top: 2rem;
    padding: 1rem 2rem;
    border-radius: 12px;
    background-color: #FFF;

    .result-item {
      padding: 0.5rem;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
      }
    }

    .result-title {
      font-weight: 600;
    }
  }
}

@media screen and (min-width: 992px) {
  .holiday-planner-form {
    width: 450px;
  }
}
</style>
