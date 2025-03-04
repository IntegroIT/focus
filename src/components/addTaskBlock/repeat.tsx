const Repeat = () => {
  return (
    <div className="repeat">
      <label htmlFor="repeatDay">
        Ежедневно
        <input type="radio" id="repeatDay" name="repeat" value="repeat" />
      </label>

      <label htmlFor="repeatWeek">
        Еженедельно
        <input type="radio" id="repeatWeek" name="repeat" value="repeat" />
      </label>

      <label htmlFor="repeatMonth">
        Ежемесячно
        <input type="radio" id="repeatMonth" name="repeat" value="repeat" />
      </label>

      <label htmlFor="repeatYear">
        Ежегодно
        <input type="radio" id="repeatYear" name="repeat" value="repeat" />
      </label>

      <label htmlFor="repeatCustum">
        Настроить
        <input type="radio" id="repeatCustum" name="repeat" value="repeat" />
      </label>
    </div>
  );
};
export default Repeat;
