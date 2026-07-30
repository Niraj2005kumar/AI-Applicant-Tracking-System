import { useParams } from "react-router-dom";
import JobForm from "../../components/jobs/JobForm";

const ManageJobForm = () => {
  const { id } = useParams();

  return (
    <div className="manage-job-page" style={{ padding: "2rem 0" }}>
      <JobForm jobId={id} />
    </div>
  );
};

export default ManageJobForm;
