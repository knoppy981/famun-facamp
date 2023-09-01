import TextField from '~/styled-components/components/textField';
import DataChangeInputBox from '~/styled-components/components/inputBox/dataChange'

import * as S from "../elements"

const SocialMediaData = (props) => {

  const { formData, handleChange, isDisabled, actionData } = props

  return (
    <S.Container>
      <S.ContainerTitle border="blue">
        Redes Sociais
      </S.ContainerTitle>

      <DataChangeInputBox>
        {["instagram", "facebook", "linkedin"].map((socialMedia, index) => (
          <TextField
            key={index}
            name={`delegationAdvisor.${socialMedia}`}
            label={socialMedia.charAt(0).toUpperCase() + socialMedia.slice(1)}
            type="text"
            defaultValue={formData?.delegationAdvisor?.[socialMedia]}
            onChange={handleChange}
            isDisabled={isDisabled}
            placeholder="adicionar"
            err={actionData?.errors?.[socialMedia]}
          />
        ))}
      </DataChangeInputBox>
    </S.Container>
  )
}

export default SocialMediaData