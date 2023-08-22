export default `
*,
*::before,
*::after {
    color: white !important;
}

html,
.swagger-ui {
    min-height: 100vh !important;
}

.swagger-ui {
    background-color: #4f5b62;
}

.swagger-ui .opblock-tag {
    background-color: #374349;
    border-radius: 10px;
}
.swagger-ui .opblock-tag:hover {
    background-color: #1a2935;
}

.swagger-ui .expand-operation {
    background-color: white;
    display: flex;
    border-radius: 100px;
    height: 32px;
    align-items: center;
}

.swagger-ui .opblock .opblock-section-header {
    background-color: #374349;
}

.swagger-ui .opblock-body select {
    background-color: #111b23;
}

.swagger-ui section.models h4 {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.2);
}

.swagger-ui section.models h4 span {
    padding: 5px;
}

textarea, input { color: #3b4151 !important; }

.swagger-ui .authorization__btn.unlocked {
    background-color: white;
    padding: 3px;
    margin-left: 10px;
    border-radius: 50px;
}
`;
