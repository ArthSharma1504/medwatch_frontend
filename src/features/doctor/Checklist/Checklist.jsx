import { useState, useEffect, useRef } from 'react';
import Card from '../../../components/Card';
import useAppStore from '../../../store/useAppStore';
import gsap from 'gsap';

const Checklist = () => {
  const { patients, isolationChecklists, updateChecklist } = useAppStore();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const containerRef = useRef(null);

  const mdrPatients = patients.filter((p) => p.status === 'red');

  const defaultChecklist = [
    { id: 1, task: 'Order Terminal Clean', completed: false, timestamp: null },
    { id: 2, task: 'Initiate Isolation Order', completed: false, timestamp: null },
    { id: 3, task: 'Notify Infection Control Team', completed: false, timestamp: null },
    { id: 4, task: 'Notify Admin Department', completed: false, timestamp: null },
    { id: 5, task: 'Update Patient Records', completed: false, timestamp: null },
    { id: 6, task: 'Arrange Contact Tracing', completed: false, timestamp: null },
    { id: 7, task: 'Place Signage on Door', completed: false, timestamp: null },
    { id: 8, task: 'Brief Nursing Staff', completed: false, timestamp: null },
  ];

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handlePatientSelect = (patientId) => {
    setSelectedPatient(patientId);
  };

  const handleToggleTask = (taskId) => {
    if (!selectedPatient) return;

    const currentChecklist = isolationChecklists[selectedPatient] || defaultChecklist;
    const updatedChecklist = currentChecklist.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            timestamp: !task.completed ? new Date().toISOString() : null,
          }
        : task
    );

    updateChecklist(selectedPatient, updatedChecklist);
  };

  const getChecklist = () => {
    if (!selectedPatient) return defaultChecklist;
    return isolationChecklists[selectedPatient] || defaultChecklist;
  };

  const checklist = getChecklist();
  const completionRate = checklist.length > 0
    ? Math.round((checklist.filter((t) => t.completed).length / checklist.length) * 100)
    : 0;

  return (
    <div ref={containerRef} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-text">MDR Protocol & Isolation Checklist</h1>
        <p className="text-gray-600 mt-1">Track isolation procedures / Isolation checklist dekho</p>
      </div>

      {/* Patient Selection */}
      <Card title="Select MDR+ Patient" icon="ri-user-line">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mdrPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientSelect(patient.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPatient === patient.id
                  ? 'border-primary-teal bg-light-teal shadow-lg'
                  : 'border-grey-light hover:border-accent-blue'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://source.unsplash.com/80x80/?portrait,${patient.id}`}
                  alt={patient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-dark-text">{patient.name}</p>
                  <p className="text-xs text-gray-600">{patient.id} • Room {patient.room}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mdrPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <i className="ri-checkbox-circle-line text-5xl mb-2"></i>
            <p>No MDR-positive patients currently / Koi MDR+ patient nahi hai</p>
          </div>
        )}
      </Card>

      {/* Checklist */}
      {selectedPatient && (
        <>
          {/* Progress Bar */}
          <Card title="Completion Progress" icon="ri-progress-4-line">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
                <span className="text-2xl font-bold text-primary-teal">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-teal to-cta-green h-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                {checklist.filter((t) => t.completed).length} of {checklist.length} tasks completed
              </p>
            </div>
          </Card>

          {/* Checklist Items */}
          <Card title="Isolation Protocol Checklist" icon="ri-checkbox-multiple-line">
            <div className="space-y-3">
              {checklist.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 transition-all ${
                    task.completed
                      ? 'bg-green-50 border-green-500'
                      : 'bg-white border-grey-light hover:border-accent-blue'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-cta-green text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-primary-teal hover:text-white'
                      }`}
                    >
                      {task.completed ? (
                        <i className="ri-checkbox-circle-fill text-xl"></i>
                      ) : (
                        <i className="ri-checkbox-blank-circle-line text-xl"></i>
                      )}
                    </button>

                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.completed ? 'text-green-700 line-through' : 'text-dark-text'
                        }`}
                      >
                        {task.task}
                      </p>
                      {task.completed && task.timestamp && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Completed on {new Date(task.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <Card>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const allCompleted = checklist.every((t) => t.completed);
                  const updatedChecklist = checklist.map((task) => ({
                    ...task,
                    completed: !allCompleted,
                    timestamp: !allCompleted ? new Date().toISOString() : null,
                  }));
                  updateChecklist(selectedPatient, updatedChecklist);
                }}
                className="flex-1 bg-primary-teal text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                {checklist.every((t) => t.completed) ? 'Uncheck All' : 'Complete All'}
              </button>
              <button
                onClick={() => {
                  alert('Checklist exported / Report send ho gayi!');
                }}
                className="flex-1 bg-cta-green text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
              >
                <i className="ri-file-download-line mr-2"></i>
                Export Report / Report Nikalo
              </button>
            </div>
          </Card>
        </>
      )}

      {!selectedPatient && mdrPatients.length > 0 && (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <i className="ri-user-search-line text-6xl mb-4"></i>
            <p className="text-lg">Select an MDR+ patient to view checklist</p>
            <p className="text-sm">Patient select karein</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Checklist;
