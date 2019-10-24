export class Miles {
    value: string;
    operator: string;
}

export class IssueConditions {
    miles: Miles;
    brand: string;
    model: string;
}

export class Conditions {
    miles: string;
}

export class Option {
    code: string;
    value: string;
}

export class PrimaryQuestion {
    key: string;
    title: string;
    required: boolean;
    type: string;
    conditions: Conditions;
    options: Option[];
}

export class Question {
    // tslint:disable-next-line: variable-name
    primary_question: PrimaryQuestion;
    // tslint:disable-next-line: variable-name
    sub_questions: any[];
    category: string;
}

export class Issue {
    // tslint:disable-next-line: variable-name
    _id: string;
    // tslint:disable-next-line: variable-name
    issue_title: string;
    // tslint:disable-next-line: variable-name
    issue_description: string;
    // tslint:disable-next-line: variable-name
    issue_conditions: IssueConditions;
    question: Question;
    createDate: Date;
}

