import styled from "styled-components";

export default styled.div`
  background: ${props => props.theme.colors.cardBackground};
  padding: 24px;
  border-radius: 5px;
  

  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100px;
`;