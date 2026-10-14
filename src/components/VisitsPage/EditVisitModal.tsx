import type { Visit } from '../../app/models/visitTypes'

type Props = {
    visit: Visit | null,
    onClose: () => void,
}

const EditVisitModal = (_props: Props) => {
    return (
        <div>EditVisitModal</div>
    )
}

export default EditVisitModal